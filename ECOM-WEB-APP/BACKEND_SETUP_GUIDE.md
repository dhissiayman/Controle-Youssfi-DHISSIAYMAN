# Backend Setup Guide - Required Changes

## ⚠️ IMPORTANT: Gateway Service Needs CORS Configuration

The Gateway service (Spring Cloud Gateway) **MUST** have CORS configured to allow requests from the Angular frontend (`http://localhost:4200`).

## Required Backend Changes

### 1. Add CORS Configuration to Gateway Service

**File to modify:** `Gateway-service/src/main/java/ma/emsi/dhissiayman/tp4/gatewayservice/GatewayServiceApplication.java`

**Add this CORS configuration:**

```java
package ma.emsi.dhissiayman.tp4.gatewayservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.ReactiveDiscoveryClient;
import org.springframework.cloud.gateway.discovery.DiscoveryClientRouteDefinitionLocator;
import org.springframework.cloud.gateway.discovery.DiscoveryLocatorProperties;
import org.springframework.context.annotation.Bean;
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

    // ADD THIS CORS CONFIGURATION
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        corsConfig.setMaxAge(3600L);
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
```

### 2. Verify Gateway Configuration File

**File:** `Gateway-service/src/main/resources/a.yml`

Make sure the routes are correctly configured:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: r1
          uri: lb://CUSTOMER-SERVICE
          predicates:
            - Path=/api/customers/**
        - id: r2
          uri: lb://INVENTORY-SERVICE
          predicates:
            - Path=/api/products/**
```

**Note:** The file is named `a.yml` - make sure Spring Boot is loading it. You might need to rename it to `application.yml` or add it to `application.properties`:

```properties
spring.cloud.gateway.routes[0].id=r1
spring.cloud.gateway.routes[0].uri=lb://CUSTOMER-SERVICE
spring.cloud.gateway.routes[0].predicates[0]=Path=/api/customers/**
spring.cloud.gateway.routes[1].id=r2
spring.cloud.gateway.routes[1].uri=lb://INVENTORY-SERVICE
spring.cloud.gateway.routes[1].predicates[0]=Path=/api/products/**
```

## Startup Order

Start services in this order:

1. **Discovery Service (Eureka)** - Port 8761
   ```bash
   cd Discovery-service
   mvn spring-boot:run
   # Or: ./mvnw spring-boot:run
   ```
   Verify: Open http://localhost:8761

2. **Config Service** - Port 9999 (if using)
   ```bash
   cd config-service
   mvn spring-boot:run
   ```

3. **Customer Service** - Port 8081
   ```bash
   cd customer-service
   mvn spring-boot:run
   ```

4. **Inventory Service** - Port 8082
   ```bash
   cd Inventory-service
   mvn spring-boot:run
   ```

5. **Billing Service** - Port 8083
   ```bash
   cd Billing-service
   mvn spring-boot:run
   ```

6. **Gateway Service** - Port 8088 (MUST be last)
   ```bash
   cd Gateway-service
   mvn spring-boot:run
   ```

## Verification Steps

### 1. Check Eureka Dashboard
- Open: http://localhost:8761
- Verify all services are registered and UP:
  - CUSTOMER-SERVICE
  - INVENTORY-SERVICE
  - BILLING-SERVICE
  - GATEWAY-SERVICE

### 2. Test Gateway Directly
```bash
# Test customer endpoint via gateway
curl http://localhost:8088/api/customers

# Test product endpoint via gateway
curl http://localhost:8088/api/products
```

### 3. Test from Browser Console
Open browser DevTools (F12) → Console tab, then run:
```javascript
fetch('http://localhost:8088/api/customers')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

### 4. Check CORS Headers
In browser DevTools → Network tab:
- Make a request to the gateway
- Check Response Headers for:
  - `Access-Control-Allow-Origin: http://localhost:4200`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH`

## Common Issues

### Issue: "Connection refused" or Status 0
**Solution:**
- Gateway service is not running
- Start Gateway service on port 8088

### Issue: Services not appearing in Eureka
**Solution:**
- Check service `application.properties` has correct Eureka URL
- Verify Discovery Service is running first
- Check service names match (case-sensitive)

### Issue: 404 from Gateway
**Solution:**
- Verify routes in `a.yml` or `application.properties`
- Check services are registered in Eureka
- Verify service names in routes match Eureka registration names

### Issue: CORS errors in browser
**Solution:**
- Add CORS configuration to Gateway (see above)
- Verify `Access-Control-Allow-Origin` header includes `http://localhost:4200`

## Quick Test Script

After starting all services, test with:

```bash
# Test Discovery Service
curl http://localhost:8761

# Test Gateway
curl http://localhost:8088/api/customers

# Test Customer Service directly
curl http://localhost:8081/api/customers

# Test Inventory Service directly
curl http://localhost:8082/api/products
```

## Port Summary

| Service | Port | URL |
|---------|------|-----|
| Discovery (Eureka) | 8761 | http://localhost:8761 |
| Config Service | 9999 | http://localhost:9999 |
| Customer Service | 8081 | http://localhost:8081 |
| Inventory Service | 8082 | http://localhost:8082 |
| Billing Service | 8083 | http://localhost:8083 |
| Gateway Service | 8088 | http://localhost:8088 |

## Next Steps

1. ✅ Add CORS configuration to Gateway Service
2. ✅ Start all services in correct order
3. ✅ Verify services in Eureka dashboard
4. ✅ Test gateway endpoints
5. ✅ Start Angular app: `cd ECOM-WEB-APP && npm start`

