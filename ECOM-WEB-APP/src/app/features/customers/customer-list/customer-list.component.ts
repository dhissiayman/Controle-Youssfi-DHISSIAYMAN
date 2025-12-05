import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Customers</h1>
      <a routerLink="/customers/new" class="btn btn-primary">+ New Customer</a>
    </div>

    <div *ngIf="loading" class="spinner"></div>

    <div *ngIf="!loading && customers.length === 0" class="empty-state">
      <div class="empty-state-icon">👥</div>
      <h2>No customers found</h2>
      <p>Get started by creating your first customer.</p>
      <a routerLink="/customers/new" class="btn btn-primary">Create Customer</a>
    </div>

    <div *ngIf="!loading && customers.length > 0" class="card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let customer of customers">
            <td>{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>
              <a [routerLink]="['/customers', customer.id]" class="btn btn-secondary" style="margin-right: 5px;">View</a>
              <a [routerLink]="['/customers', customer.id, 'edit']" class="btn btn-primary" style="margin-right: 5px;">Edit</a>
              <button (click)="deleteCustomer(customer.id)" class="btn btn-danger">Delete</button>
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
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.alertService.success('Customer deleted successfully');
          this.loadCustomers();
        }
      });
    }
  }
}

