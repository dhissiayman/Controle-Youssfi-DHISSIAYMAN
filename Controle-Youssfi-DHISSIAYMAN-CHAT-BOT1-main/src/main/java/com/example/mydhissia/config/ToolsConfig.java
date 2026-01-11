package com.example.mydhissia.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.function.Function;

@Configuration
public class ToolsConfig {

    @Bean
    @Description("Get list of all customers")
    public Function<VoidRequest, Object> customerFunction() {
        return request -> makeGetRequest("http://localhost:8088/api/customers");
    }

    @Bean
    @Description("Get list of all products in inventory")
    public Function<VoidRequest, Object> inventoryFunction() {
        return request -> makeGetRequest("http://localhost:8088/api/products");
    }

    @Bean
    @Description("Get list of all bills")
    public Function<VoidRequest, Object> billingFunction() {
        return request -> makeGetRequest("http://localhost:8088/api/bills");
    }

    @Bean
    @Description("Get list of all suppliers")
    public Function<VoidRequest, Object> supplierFunction() {
        return request -> makeGetRequest("http://localhost:8088/api/suppliers");
    }

    @Bean
    @Description("Get current sales analytics, including total bills and total suppliers")
    public Function<AnalyticsRequest, AnalyticsResponse> analyticsFunction() {
        return request -> {
             return new AnalyticsResponse((Map<String, Object>) makeGetRequest("http://localhost:8088/api/analytics"));
        };
    }

    private Object makeGetRequest(String url) {
        System.out.println("DEBUG: Chatbot invoking URL: " + url);
        RestClient restClient = RestClient.create();
        try {
            // Fetch as Map to inspect structure
            Map response = restClient.get()
                    .uri(url)
                    .header("X-Internal-Request", "chatbot")  // Add header for Gateway bypass
                    .retrieve()
                    .body(Map.class);
            
            System.out.println("DEBUG: Raw Response from " + url + ": " + response);

            // Handle Spring Data REST HAL format (_embedded)
            if (response != null && response.containsKey("_embedded")) {
                Map<String, Object> embedded = (Map<String, Object>) response.get("_embedded");
                // Return the first list found in _embedded (e.g., "products", "customers")
                if (!embedded.isEmpty()) {
                    Object content = embedded.values().iterator().next();
                    System.out.println("DEBUG: Extracted HAL content: " + content);
                    return content;
                }
            }
            
            return response;
        } catch (Exception e) {
            System.err.println("DEBUG: Error calling " + url + ": " + e.getMessage());
            e.printStackTrace();
            return Map.of("error", "Failed to fetch data from " + url + ": " + e.getMessage());
        }
    }

    public record VoidRequest(String dummy) {} 
    public record AnalyticsRequest(String dummy) {}
    public record AnalyticsResponse(Map<String, Object> data) {}
}
