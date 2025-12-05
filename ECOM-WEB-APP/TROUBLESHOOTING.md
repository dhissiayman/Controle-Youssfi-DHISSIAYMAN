# Troubleshooting Guide

## Common Error: "0 unknown error" or Connection Errors

If you're seeing "0 unknown error" or connection errors when navigating, follow these steps:

### 1. Check if Backend Services are Running

Make sure all Spring Boot services are running:

1. **Discovery Service (Eureka)** - Usually on port 8761
2. **Config Service** - Usually on port 9999
3. **Gateway Service** - Port 8088 (required for customers and products)
4. **Customer Service** - Port 8081
5. **Inventory Service** - Port 8082
6. **Billing Service** - Port 8083 (accessed directly, not through gateway)

### 2. Verify Gateway is Running

The Angular app connects to the Gateway on `http://localhost:8088`.

Test in browser or terminal:
```bash
curl http://localhost:8088/api/customers
```

If you get a connection refused error, the gateway is not running.

### 3. Check CORS Configuration

The backend services need to allow CORS from `http://localhost:4200`.

The customer-service already has CORS configured. If you're still getting CORS errors:

1. Check browser console for CORS error messages
2. Verify `RestRepositoryConfig` in customer-service allows CORS
3. Add CORS configuration to other services if needed

### 4. Verify API URLs

Check `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:8088' // Should match your gateway port
```

### 5. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for detailed error messages
- **Network tab**: Check if requests are being made and what status codes they return

### 6. Common Issues

#### Issue: "Cannot connect to server"
**Solution**: 
- Start the Gateway service (port 8088)
- Verify all microservices are registered with Eureka
- Check that services are running on correct ports

#### Issue: CORS errors
**Solution**:
- Ensure backend services have CORS enabled
- Check that requests are going to the correct origin

#### Issue: 404 errors
**Solution**:
- Verify the gateway routes are configured correctly
- Check that services are registered with service discovery
- Verify the API paths match the backend controllers

#### Issue: Billing service errors
**Solution**:
- Billing service uses direct URL (port 8083), not gateway
- Make sure billing service is running on port 8083
- Check `src/app/config/api.config.ts` - BILLS_ENDPOINT should be `http://localhost:8083/bills`

### 7. Testing Backend Services

Test each service individually:

```bash
# Test Gateway
curl http://localhost:8088/api/customers

# Test Customer Service directly
curl http://localhost:8081/api/customers

# Test Inventory Service directly
curl http://localhost:8082/api/products

# Test Billing Service directly
curl http://localhost:8083/bills/1
```

### 8. Angular Development Server

Make sure Angular dev server is running:
```bash
cd ECOM-WEB-APP
npm start
```

The app should be available at `http://localhost:4200`

### 9. Check Service Discovery

Verify services are registered with Eureka:
- Open `http://localhost:8761` (Eureka dashboard)
- Check that all services are listed and UP

### 10. Environment Configuration

If you're using different ports, update:
- `src/environments/environment.ts` - For development
- `src/environments/environment.prod.ts` - For production

## Still Having Issues?

1. Check the browser console for detailed error messages
2. Check the Network tab to see the actual HTTP requests and responses
3. Verify all backend services are running and accessible
4. Check that the gateway service is routing requests correctly
5. Ensure CORS is properly configured on all backend services

