/**
 * Product model matching Spring Product entity
 */
export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Product DTO for creating/updating products
 * Note: ID is required for Product entity (String type, not auto-generated)
 */
export interface ProductDto {
  id?: string; // Optional for creation, will be generated if not provided
  name: string;
  price: number;
  quantity: number;
}

