import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { Product } from '../../../models/product.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Product Details</h1>
      <div>
        <a [routerLink]="['/products', product?.id, 'edit']" class="btn btn-primary" style="margin-right: 10px;">Edit</a>
        <a routerLink="/products" class="btn btn-secondary">Back to List</a>
      </div>
    </div>

    <div *ngIf="loading" class="spinner"></div>

    <div *ngIf="!loading && product" class="card">
      <div class="card-header">Product Information</div>
      <div class="detail-group">
        <label>ID:</label>
        <div class="detail-value">{{ product.id }}</div>
      </div>
      <div class="detail-group">
        <label>Name:</label>
        <div class="detail-value">{{ product.name }}</div>
      </div>
      <div class="detail-group">
        <label>Price:</label>
        <div class="detail-value">{{ '$' + product.price }}</div>
      </div>
      <div class="detail-group">
        <label>Quantity:</label>
        <div class="detail-value">
          <span [class]="'badge ' + (product.quantity > 0 ? 'badge-success' : 'badge-danger')">
            {{ product.quantity }}
          </span>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && !product" class="alert alert-error">
      Product not found
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

    .detail-group {
      margin-bottom: 20px;
    }

    .detail-group label {
      display: block;
      font-weight: 600;
      color: #7f8c8d;
      margin-bottom: 5px;
      font-size: 14px;
    }

    .detail-value {
      font-size: 16px;
      color: #2c3e50;
      padding: 8px 0;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.loading = true;
    this.inventoryService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Failed to load product');
      }
    });
  }
}

