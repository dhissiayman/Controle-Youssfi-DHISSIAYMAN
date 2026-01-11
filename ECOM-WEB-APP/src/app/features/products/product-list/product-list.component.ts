import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { Product } from '../../../models/product.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Products</h1>
      <a routerLink="/products/new" class="btn btn-primary">+ New Product</a>
    </div>

    <div *ngIf="loading" class="spinner"></div>

    <div *ngIf="!loading && products.length === 0" class="empty-state">
      <div class="empty-state-icon">📦</div>
      <h2>No products found</h2>
      <p>Get started by creating your first product.</p>
      <a routerLink="/products/new" class="btn btn-primary">Create Product</a>
    </div>

    <div *ngIf="!loading && products.length > 0" class="card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let product of products">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ '$' + product.price }}</td>
            <td>
              <span [class]="'badge ' + (product.quantity > 0 ? 'badge-success' : 'badge-danger')">
                {{ product.quantity }}
              </span>
            </td>
            <td>
              <a [routerLink]="['/products', product.id]" class="btn btn-secondary" style="margin-right: 5px;">View</a>
              <a [routerLink]="['/products', product.id, 'edit']" class="btn btn-primary" style="margin-right: 5px;">Edit</a>
              <button (click)="deleteProduct(product.id)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #2c3e50;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .empty-state-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }

    .empty-state h2 {
      margin-bottom: 10px;
      color: #2c3e50;
    }

    .empty-state p {
      color: #7f8c8d;
      margin-bottom: 20px;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.inventoryService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.inventoryService.deleteProduct(id).subscribe({
        next: () => {
          this.alertService.success('Product deleted successfully');
          this.loadProducts();
        }
      });
    }
  }
}

