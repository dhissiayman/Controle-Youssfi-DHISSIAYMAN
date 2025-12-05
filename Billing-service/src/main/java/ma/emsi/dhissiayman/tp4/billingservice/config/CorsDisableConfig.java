package ma.emsi.dhissiayman.tp4.billingservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuration to disable CORS in Billing Service
 * 
 * CORS is handled entirely by the API Gateway.
 * This service should NOT add any CORS headers to avoid duplicates.
 * 
 * This configuration:
 * - Disables CORS in Spring Data REST (if any endpoints are exposed)
 * - Disables CORS in Spring MVC
 * - Ensures no CORS headers are added by this service
 */
@Configuration
public class CorsDisableConfig implements RepositoryRestConfigurer, WebMvcConfigurer {

    /**
     * Disable CORS in Spring Data REST
     * Prevents Spring Data REST from adding CORS headers
     * 
     * By not adding any CORS mappings, Spring Data REST won't add CORS headers
     */
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // Do nothing - this prevents Spring Data REST from adding CORS headers
        // The Gateway handles all CORS configuration
    }

    /**
     * Disable CORS in Spring MVC
     * Prevents Spring MVC from adding CORS headers
     * 
     * By not adding any CORS mappings, Spring MVC won't add CORS headers
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Do nothing - this prevents Spring MVC from adding CORS headers
        // The Gateway handles all CORS configuration
    }
}

