import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Customer Details</h1>
      <div>
        <a [routerLink]="['/customers', customer?.id, 'edit']" class="btn btn-primary" style="margin-right: 10px;">Edit</a>
        <a routerLink="/customers" class="btn btn-secondary">Back to List</a>
      </div>
    </div>

    <div *ngIf="loading" class="spinner"></div>

    <div *ngIf="!loading && customer" class="card">
      <div class="card-header">Customer Information</div>
      <div class="detail-group">
        <label>ID:</label>
        <div class="detail-value">{{ customer.id }}</div>
      </div>
      <div class="detail-group">
        <label>Name:</label>
        <div class="detail-value">{{ customer.name }}</div>
      </div>
      <div class="detail-group">
        <label>Email:</label>
        <div class="detail-value">{{ customer.email }}</div>
      </div>
    </div>

    <div *ngIf="!loading && !customer" class="alert alert-error">
      Customer not found
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
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.loading = true;
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Failed to load customer');
      }
    });
  }
}

