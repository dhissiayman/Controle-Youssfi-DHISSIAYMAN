import { Customer } from './customer.model';
import { Product } from './product.model';

/**
 * ProductItem model matching Spring ProductItem entity
 */
export interface ProductItem {
  id: number;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product; // Transient field populated by backend
}

/**
 * Bill model matching Spring Bill entity
 */
export interface Bill {
  id: number;
  billingDate: string; // ISO date string
  customerId: number;
  productItems: ProductItem[];
  customer?: Customer; // Transient field populated by backend
}

