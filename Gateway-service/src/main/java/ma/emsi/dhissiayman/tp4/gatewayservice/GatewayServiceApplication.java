package ma.emsi.dhissiayman.tp4.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.ReactiveDiscoveryClient;
import org.springframework.cloud.gateway.discovery.DiscoveryClientRouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.discovery.DiscoveryLocatorProperties;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;


@SpringBootApplication
public class GatewayServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayServiceApplication.class, args);
    }

    @Bean
    DiscoveryClientRouteDefinitionLocator locator(
            ReactiveDiscoveryClient rdc, DiscoveryLocatorProperties dlp
    ){
        return new DiscoveryClientRouteDefinitionLocator(rdc, dlp);
    }

    /**
     * CORS Configuration for Gateway
     * Allows Angular frontend (http://localhost:4200) to access the API
     * 
     * IMPORTANT: After modifying this, restart the Gateway Service!
     */
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        
        // Allow Angular frontend origin
        corsConfig.setAllowedOriginPatterns(Collections.singletonList("http://localhost:4200"));
        // Also set allowed origins for compatibility
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        
        // Allow all HTTP methods
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        
        // Expose response headers to frontend
        corsConfig.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Total-Count",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Allow credentials (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);
        
        // Cache preflight requests for 1 hour
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply CORS to all paths
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
