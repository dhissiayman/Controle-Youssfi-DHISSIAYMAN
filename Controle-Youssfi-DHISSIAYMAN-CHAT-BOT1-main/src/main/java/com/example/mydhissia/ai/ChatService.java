package com.example.mydhissia.ai;

import com.example.mydhissia.mcp.MCPClientService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final ConversationMemoryService conversationMemoryService;
    private final MCPClientService mcpClientService;
    private final com.example.mydhissia.rag.RagQueryService ragQueryService;

    public ChatService(ChatModel chatModel,
                       ConversationMemoryService conversationMemoryService,
                       MCPClientService mcpClientService,
                       com.example.mydhissia.rag.RagQueryService ragQueryService) {
        // Use ChatClient with default function support
        this.chatClient = ChatClient.builder(chatModel)
                .defaultFunctions("analyticsFunction", "customerFunction", "inventoryFunction", "billingFunction", "supplierFunction")
                .build();
        this.conversationMemoryService = conversationMemoryService;
        this.mcpClientService = mcpClientService;
        this.ragQueryService = ragQueryService;
    }

    public String answerWithRag(Long chatId, String userMessage) {
        return ragQueryService.ask(userMessage);
    }

    public String handleUserMessage(Long chatId, String userMessage) {
        // 1. Retrieve relevant history
        List<String> history = conversationMemoryService.retrieveRelevantMessages(chatId, userMessage, 5);
        String context = String.join("\n", history);

        // 2. Check for manual MCP tools (Time, Tavily)
        String toolOutput = "";
        if (userMessage.toLowerCase().contains("time")) {
             toolOutput += "Tool 'getTime' output: " + mcpClientService.callTool("getTime", "{}") + "\n";
        }

        if (userMessage.toLowerCase().contains("search") || userMessage.toLowerCase().contains("tavily")) {
            String escapedQuery = userMessage.replace("\"", "\\\"");
            String jsonArgs = "{\"query\": \"" + escapedQuery + "\"}";
            toolOutput += "Tool 'tavilySearch' output: " + mcpClientService.callTool("tavilySearch", jsonArgs) + "\n";
        }

        // 3. Construct system prompt
        String systemPrompt = "You are a helpful AI assistant named MyDHISSIA. " +
                "You have access to previous conversation context and tools.\n" +
                "Context:\n" + context + "\n" +
                "Tool Outputs:\n" + toolOutput + "\n" +
                "Respond naturally.";

        // 4. Call LLM with ChatClient (enables analyticsFunction automatically)
        String response = chatClient.prompt()
                .system(systemPrompt)
                .user(userMessage)
                .call()
                .content();

        // 5. Save new turn to memory
        conversationMemoryService.saveMessage(chatId, "user", userMessage);
        conversationMemoryService.saveMessage(chatId, "assistant", response);

        return response;
    }
}
