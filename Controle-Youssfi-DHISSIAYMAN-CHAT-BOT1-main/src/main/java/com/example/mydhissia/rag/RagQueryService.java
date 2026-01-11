package com.example.mydhissia.rag;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RagQueryService {

    private static final Logger log = LoggerFactory.getLogger(RagQueryService.class);

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public RagQueryService(ChatModel chatModel, VectorStore vectorStore) {
        // Use the new Fluent ChatClient API backed by the low-level ChatModel
        this.chatClient = ChatClient.create(chatModel);
        this.vectorStore = vectorStore;
    }

    public String ask(String query) {
        log.info("RAG Query: {}", query);

        // 1. Retrieve similar documents
        List<Document> similarDocuments = vectorStore.similaritySearch(SearchRequest.query(query).withTopK(3));
        
        String context = similarDocuments.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n\n"));

        log.info("Found {} relevant documents.", similarDocuments.size());
        log.debug("Context: {}", context);

        if (similarDocuments.isEmpty()) {
            return "I couldn't find any information in my knowledge base regarding your query.";
        }

        // 2. Construct Prompt and Call LLM using Fluent API
        String systemPromptText = """
                You are a helpful assistant. Use the following information to answer the user's question.
                If the information is not sufficient to answer, say so.
                
                Context:
                {context}
                """;

        String answer = chatClient.prompt()
                .system(sp -> sp.text(systemPromptText).param("context", context))
                .user(query)
                .functions("analyticsFunction") // Register function call via Fluent API
                .call()
                .content();
                
        return "[Source: RAG] " + answer;
    }
}
