# Quick Start Guide

## 🚨 Before Starting Angular App

**You MUST start the backend services first!**

## Step 1: Add CORS to Gateway Service

The Gateway service needs CORS configuration. See `BACKEND_SETUP_GUIDE.md` for the exact code to add.

**Quick fix:** Add this to `Gateway-service/src/main/java/.../GatewayServiceApplication.java`:

```java
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
```

Don't forget to add imports:
```java
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import java.util.Collections;
```

## Step 2: Start Backend Services

**Start in this order:**

1. **Discovery Service** (Eureka) - Port 8761
   ```bash
   cd Discovery-service
   mvn spring-boot:run
   ```
   Wait until you see "Started DiscoveryServiceApplication"

2. **Customer Service** - Port 8081
   ```bash
   cd customer-service
   mvn spring-boot:run
   ```

3. **Inventory Service** - Port 8082
   ```bash
   cd Inventory-service
   mvn spring-boot:run
   ```

4. **Billing Service** - Port 8083
   ```bash
   cd Billing-service
   mvn spring-boot:run
   ```

5. **Gateway Service** - Port 8088 ⚠️ **MUST BE LAST**
   ```bash
   cd Gateway-service
   mvn spring-boot:run
   ```

## Step 3: Verify Services

1. **Check Eureka Dashboard:**
   - Open: http://localhost:8761
   - You should see all services registered

2. **Test Gateway:**
   ```bash
   curl http://localhost:8088/api/customers
   ```
   Should return customer data or empty array `[]`

## Step 4: Start Angular App

```bash
cd ECOM-WEB-APP
npm start
```

The app will open at: http://localhost:4200

## Troubleshooting

### "Cannot connect to server" Error

1. ✅ Is Gateway running on port 8088?
   ```bash
   curl http://localhost:8088/api/customers
   ```

2. ✅ Are services registered in Eureka?
   - Check: http://localhost:8761

3. ✅ Is CORS configured in Gateway?
   - See Step 1 above

4. ✅ Check browser console (F12) for detailed errors

### Still Having Issues?

See `TROUBLESHOOTING.md` for detailed solutions.

