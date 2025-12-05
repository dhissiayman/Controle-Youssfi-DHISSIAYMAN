# E-Commerce Management System - Angular Frontend

This is the Angular frontend application for the E-Commerce Management System. It communicates with the Spring Cloud microservices backend through the API Gateway.

## Project Structure

```
ECOM-WEB-APP/
├── src/
│   ├── app/
│   │   ├── config/              # API configuration
│   │   ├── features/             # Feature modules
│   │   │   ├── customers/       # Customer CRUD
│   │   │   ├── products/        # Product CRUD
│   │   │   └── bills/           # Bill viewing
│   │   ├── interceptors/         # HTTP interceptors
│   │   ├── layout/              # Layout components
│   │   ├── models/              # TypeScript interfaces
│   │   ├── services/            # API services
│   │   └── shared/              # Shared components
│   ├── environments/            # Environment configuration
│   └── styles.css               # Global styles
├── angular.json
├── package.json
└── tsconfig.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v18 or higher)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Angular CLI globally (if not already installed):**
   ```bash
   npm install -g @angular/cli
   ```

## Configuration

### API Gateway URL

The application is configured to communicate with the Spring Cloud Gateway. The default gateway URL is:

- **Development:** `http://localhost:8088`
- **Production:** Update `src/environments/environment.prod.ts`

To change the API URL, edit the `apiUrl` property in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Running the Application

1. **Start the development server:**
   ```bash
   npm start
   # or
   ng serve
   ```

2. **Open your browser:**
   Navigate to `http://localhost:4200`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Features

### Customers Management
- **List Customers:** View all customers
- **View Customer:** View customer details
- **Create Customer:** Add a new customer
- **Update Customer:** Edit existing customer
- **Delete Customer:** Remove a customer

**API Endpoints (via Gateway):**
- `GET /api/customers` - List all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Products Management
- **List Products:** View all products with inventory status
- **View Product:** View product details
- **Create Product:** Add a new product
- **Update Product:** Edit existing product
- **Delete Product:** Remove a product

**API Endpoints (via Gateway):**
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Bills Management
- **View Bill:** View bill details with customer and product items
- **List Bills:** Attempts to list all bills (may not be available)

**API Endpoints:**
- `GET /bills/{id}` - Get bill by ID (with populated customer and products)
- `GET /bills` - List all bills (may return 404 if not implemented)

**Note:** The billing service endpoint `/bills/{id}` is currently not routed through the gateway. If you want to route it through the gateway, add the following route to the gateway configuration:

```yaml
# In Gateway-service/src/main/resources/a.yml
- id: r3
  uri: lb://BILLING-SERVICE
  predicates:
    - Path=/api/bills/**
```

Then update `src/app/config/api.config.ts` to use `/api/bills` instead of `/bills`.

## Angular Services Mapping to Spring Controllers

### CustomerService
- Maps to: `CustomerRepository` (Spring Data REST)
- Service: `customer-service`
- Base Path: `/api/customers`
- Gateway Route: `/api/customers/**` → `CUSTOMER-SERVICE`

### InventoryService
- Maps to: `ProductRepository` (Spring Data REST)
- Service: `inventory-service`
- Base Path: `/api/products`
- Gateway Route: `/api/products/**` → `INVENTORY-SERVICE`

### BillingService
- Maps to: `BillRestController`
- Service: `billing-service`
- Base Path: `/bills` (or `/api/bills` if gateway route is added)
- Gateway Route: Not currently configured (see note above)

## Architecture

### Standalone Components
The application uses Angular standalone components (no NgModules). This is the modern Angular approach and provides:
- Better tree-shaking
- Lazy loading at the component level
- Simpler dependency management

### HTTP Interceptors
- **HttpErrorInterceptor:** Catches HTTP errors and displays user-friendly messages
- **HttpLoadingInterceptor:** Shows/hides loading spinner for HTTP requests

### Services
- **CustomerService:** Handles all customer-related API calls
- **InventoryService:** Handles all product-related API calls
- **BillingService:** Handles all bill-related API calls
- **LoadingService:** Manages global loading state
- **AlertService:** Manages toast/alert messages

### Models
TypeScript interfaces that match the Spring backend entities:
- `Customer` / `CustomerDto`
- `Product` / `ProductDto`
- `Bill` / `ProductItem`
- `PagedModel<T>` (for Spring Data REST pagination)

## Error Handling

The application includes comprehensive error handling:
- HTTP errors are intercepted and displayed as user-friendly alerts
- Loading states are managed automatically
- Form validation provides immediate feedback

## Styling

The application uses a clean, modern CSS design with:
- Responsive layout
- Sidebar navigation
- Card-based UI components
- Consistent color scheme
- Loading spinners and alerts

## Development Notes

### CORS Configuration
If you encounter CORS errors, ensure the Spring backend services have CORS enabled. The customer-service already has CORS configuration in `RestRepositoryConfig.java`.

### Gateway Configuration
The gateway service runs on port 8088. Make sure:
1. The gateway service is running
2. The discovery service (Eureka) is running
3. All microservices are registered with Eureka

### Backend Services Ports
- Gateway Service: `8088`
- Customer Service: `8081`
- Inventory Service: `8082`
- Billing Service: `8083`
- Discovery Service: `8761` (default Eureka port)
- Config Service: `9999` (default Config Server port)

## Troubleshooting

### Cannot connect to backend
1. Verify the gateway service is running on port 8088
2. Check `src/environments/environment.ts` has the correct API URL
3. Check browser console for CORS errors
4. Verify all backend services are running and registered with Eureka

### 404 errors on API calls
1. Verify the gateway routes are correctly configured
2. Check that services are registered with the discovery service
3. Verify the API endpoints match the backend controllers

### Build errors
1. Run `npm install` to ensure all dependencies are installed
2. Check Node.js and npm versions match requirements
3. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Additional Backend Configuration Suggestions

If you want to improve the integration, consider:

1. **Add Billing Service Gateway Route:**
   ```yaml
   # In Gateway-service/src/main/resources/a.yml
   - id: r3
     uri: lb://BILLING-SERVICE
     predicates:
       - Path=/api/bills/**
   ```

2. **Add CORS Configuration to Billing Service:**
   Add CORS configuration similar to customer-service if needed.

3. **Add List Bills Endpoint:**
   If you want to list all bills, add a `GET /bills` endpoint in `BillRestController`.

## License

This project is part of the E-Commerce Management System.

