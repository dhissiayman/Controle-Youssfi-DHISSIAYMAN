import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ProductDto } from '../../../models/product.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ isEditMode ? 'Edit Product' : 'New Product' }}</h1>
      <a routerLink="/products" class="btn btn-secondary">Back to List</a>
    </div>

    <div class="card">
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            [class.error]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
          />
          <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error-message">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="price">Price *</label>
          <input
            id="price"
            type="number"
            formControlName="price"
            class="form-control"
            min="0"
            step="0.01"
            [class.error]="productForm.get('price')?.invalid && productForm.get('price')?.touched"
          />
          <div *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="error-message">
            Valid price is required (must be >= 0)
          </div>
        </div>

        <div class="form-group">
          <label for="quantity">Quantity *</label>
          <input
            id="quantity"
            type="number"
            formControlName="quantity"
            class="form-control"
            min="0"
            [class.error]="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched"
          />
          <div *ngIf="productForm.get('quantity')?.invalid && productForm.get('quantity')?.touched" class="error-message">
            Valid quantity is required (must be >= 0)
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="productForm.invalid || loading" class="btn btn-primary">
            {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
          <a routerLink="/products" class="btn btn-secondary">Cancel</a>
        </div>
      </form>
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

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.inventoryService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          quantity: product.quantity
        });
      },
      error: () => {
        this.alertService.error('Failed to load product');
      }
    });
  }

  /**
   * Generate a unique ID from product name
   */
  private generateProductId(name: string): string {
    // Generate ID from name: lowercase, replace spaces with hyphens, remove special chars
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 50) || 'product-' + Date.now();
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.loading = true;
      const formValue = this.productForm.value;
      const productDto: ProductDto = {
        ...formValue,
        // Generate ID if creating new product
        id: this.isEditMode ? this.productId : (formValue.id || this.generateProductId(formValue.name))
      };

      if (this.isEditMode && this.productId) {
        this.inventoryService.updateProduct(this.productId, productDto).subscribe({
          next: () => {
            this.alertService.success('Product updated successfully');
            this.router.navigate(['/products', this.productId]);
          },
          error: (err) => {
            this.loading = false;
            console.error('Error updating product:', err);
          }
        });
      } else {
        this.inventoryService.createProduct(productDto).subscribe({
          next: (product) => {
            this.alertService.success('Product created successfully');
            this.router.navigate(['/products', product.id]);
          },
          error: (err) => {
            this.loading = false;
            console.error('Error creating product:', err);
            // If error is due to ID conflict, try with timestamp
            if (err.status === 409 || err.status === 400) {
              const retryDto = { ...productDto, id: 'product-' + Date.now() };
              this.inventoryService.createProduct(retryDto).subscribe({
                next: (product) => {
                  this.alertService.success('Product created successfully');
                  this.router.navigate(['/products', product.id]);
                },
                error: (retryErr) => {
                  console.error('Error creating product (retry):', retryErr);
                }
              });
            }
          }
        });
      }
    }
  }
}

