import { environment } from '../../environments/environment';

/**
 * API Configuration
 * Centralizes the base URL for all API calls
 */
export class ApiConfig {
  /**
   * Base URL for the API Gateway
   * Default: http://localhost:8088
   */
  static readonly BASE_URL: string = environment.apiUrl;

  /**
   * Customer service endpoints (via gateway)
   */
  static readonly CUSTOMERS_ENDPOINT = `${ApiConfig.BASE_URL}/api/customers`;

  /**
   * Inventory/Product service endpoints (via gateway)
   */
  static readonly PRODUCTS_ENDPOINT = `${ApiConfig.BASE_URL}/api/products`;

  /**
   * Billing service endpoints (via gateway)
   * Gateway routes /api/bills/** to BILLING-SERVICE
   */
  static readonly BILLS_ENDPOINT = `${ApiConfig.BASE_URL}/api/bills`;
}

