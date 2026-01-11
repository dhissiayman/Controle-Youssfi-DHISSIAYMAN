import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { CustomerDto } from '../../../models/customer.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">{{ isEditMode ? 'Edit Customer' : 'New Customer' }}</h1>
      <a routerLink="/customers" class="btn btn-secondary">Back to List</a>
    </div>

    <div class="card">
      <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Name *</label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="form-control"
            [class.error]="customerForm.get('name')?.invalid && customerForm.get('name')?.touched"
          />
          <div *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched" class="error-message">
            Name is required
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="form-control"
            [class.error]="customerForm.get('email')?.invalid && customerForm.get('email')?.touched"
          />
          <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" class="error-message">
            Valid email is required
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="customerForm.invalid || loading" class="btn btn-primary">
            {{ loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
          </button>
          <a routerLink="/customers" class="btn btn-secondary">Cancel</a>
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
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  customerId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private alertService: AlertService
  ) {
    this.customerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.customerId = +id;
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          name: customer.name,
          email: customer.email
        });
      },
      error: () => {
        this.alertService.error('Failed to load customer');
      }
    });
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.loading = true;
      const customerDto: CustomerDto = this.customerForm.value;

      if (this.isEditMode && this.customerId) {
        this.customerService.updateCustomer(this.customerId, customerDto).subscribe({
          next: () => {
            this.alertService.success('Customer updated successfully');
            this.router.navigate(['/customers', this.customerId]);
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.customerService.createCustomer(customerDto).subscribe({
          next: (customer) => {
            this.alertService.success('Customer created successfully');
            this.router.navigate(['/customers', customer.id]);
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }
}

