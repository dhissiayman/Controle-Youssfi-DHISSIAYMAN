import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, CustomerDto } from '../models/customer.model';
import { PagedModel, extractContent } from '../models/paged-model.model';
import { ApiConfig } from '../config/api.config';

/**
 * Customer Service
 * Handles all HTTP operations for Customer entity
 * Maps to Spring Data REST endpoints via API Gateway
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get all customers
   * GET /api/customers
   */
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<PagedModel<Customer>>(ApiConfig.CUSTOMERS_ENDPOINT)
      .pipe(
        map(pagedModel => extractContent(pagedModel))
      );
  }

  /**
   * Get customer by ID
   * GET /api/customers/{id}
   */
  getCustomerById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${ApiConfig.CUSTOMERS_ENDPOINT}/${id}`);
  }

  /**
   * Create a new customer
   * POST /api/customers
   */
  createCustomer(customerDto: CustomerDto): Observable<Customer> {
    return this.http.post<Customer>(
      ApiConfig.CUSTOMERS_ENDPOINT,
      customerDto,
      this.httpOptions
    );
  }

  /**
   * Update an existing customer
   * PUT /api/customers/{id}
   */
  updateCustomer(id: number, customerDto: CustomerDto): Observable<Customer> {
    return this.http.put<Customer>(
      `${ApiConfig.CUSTOMERS_ENDPOINT}/${id}`,
      customerDto,
      this.httpOptions
    );
  }

  /**
   * Delete a customer
   * DELETE /api/customers/{id}
   */
  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiConfig.CUSTOMERS_ENDPOINT}/${id}`);
  }
}

