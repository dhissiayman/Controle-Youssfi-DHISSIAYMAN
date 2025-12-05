import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductDto } from '../models/product.model';
import { PagedModel, extractContent } from '../models/paged-model.model';
import { ApiConfig } from '../config/api.config';

/**
 * Inventory Service (Product Service)
 * Handles all HTTP operations for Product entity
 * Maps to Spring Data REST endpoints via API Gateway
 */
@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all products
   * GET /api/products
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<PagedModel<Product>>(ApiConfig.PRODUCTS_ENDPOINT)
      .pipe(
        map(pagedModel => extractContent(pagedModel))
      );
  }

  /**
   * Get product by ID
   * GET /api/products/{id}
   */
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${ApiConfig.PRODUCTS_ENDPOINT}/${id}`);
  }

  /**
   * Create a new product
   * POST /api/products
   */
  createProduct(productDto: ProductDto): Observable<Product> {
    return this.http.post<Product>(
      ApiConfig.PRODUCTS_ENDPOINT,
      productDto,
      this.httpOptions
    );
  }

  /**
   * Update an existing product
   * PUT /api/products/{id}
   */
  updateProduct(id: string, productDto: ProductDto): Observable<Product> {
    return this.http.put<Product>(
      `${ApiConfig.PRODUCTS_ENDPOINT}/${id}`,
      productDto,
      this.httpOptions
    );
  }

  /**
   * Delete a product
   * DELETE /api/products/{id}
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${ApiConfig.PRODUCTS_ENDPOINT}/${id}`);
  }
}

