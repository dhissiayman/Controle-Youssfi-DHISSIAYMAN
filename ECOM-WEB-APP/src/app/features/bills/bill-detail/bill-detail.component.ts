import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../../services/billing.service';
import { Bill } from '../../../models/bill.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-bill-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Bill Details</h1>
      <a routerLink="/bills" class="btn btn-secondary">Back to List</a>
    </div>

    <div *ngIf="loading" class="spinner"></div>

    <div *ngIf="!loading && bill" class="bill-detail">
      <div class="card">
        <div class="card-header">Bill Information</div>
        <div class="detail-group">
          <label>Bill ID:</label>
          <div class="detail-value">{{ bill.id }}</div>
        </div>
        <div class="detail-group">
          <label>Billing Date:</label>
          <div class="detail-value">{{ formatDate(bill.billingDate) }}</div>
        </div>
        <div class="detail-group" *ngIf="bill.customer">
          <label>Customer:</label>
          <div class="detail-value">
            <strong>{{ bill.customer.name }}</strong><br>
            <span style="color: #7f8c8d; font-size: 14px;">{{ bill.customer.email }}</span>
          </div>
        </div>
        <div class="detail-group" *ngIf="!bill.customer">
          <label>Customer ID:</label>
          <div class="detail-value">{{ bill.customerId }}</div>
        </div>
        <div class="detail-group">
          <label>Total Amount:</label>
          <div class="detail-value total-amount">{{ '$' + calculateTotal(bill) }}</div>
        </div>
      </div>

      <div class="card" *ngIf="bill.productItems && bill.productItems.length > 0">
        <div class="card-header">Product Items</div>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of bill.productItems">
              <td>
                <div *ngIf="item.product">
                  <strong>{{ item.product.name }}</strong><br>
                  <span style="color: #7f8c8d; font-size: 12px;">ID: {{ item.product.id }}</span>
                </div>
                <div *ngIf="!item.product">
                  Product ID: {{ item.productId }}
                </div>
              </td>
              <td>{{ item.quantity }}</td>
              <td>{{ '$' + item.unitPrice }}</td>
              <td>{{ '$' + (item.unitPrice * item.quantity).toFixed(2) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right; font-weight: 600;">Total:</td>
              <td style="font-weight: 600; font-size: 16px;">{{ '$' + calculateTotal(bill) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div *ngIf="!bill.productItems || bill.productItems.length === 0" class="card">
        <div class="empty-state">
          <p>No product items found for this bill.</p>
        </div>
      </div>
    </div>

    <div *ngIf="!loading && !bill" class="alert alert-error">
      Bill not found
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

    .bill-detail {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .total-amount {
      font-size: 24px;
      font-weight: 600;
      color: #27ae60;
    }

    .table tfoot {
      border-top: 2px solid #eee;
      background-color: #f8f9fa;
    }

    .empty-state {
      text-align: center;
      padding: 20px;
      color: #7f8c8d;
    }
  `]
})
export class BillDetailComponent implements OnInit {
  bill: Bill | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private billingService: BillingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log('Bill ID from route:', idParam);
    
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id) && id > 0) {
        this.loadBill(id);
      } else {
        console.error('Invalid bill ID:', idParam);
        this.alertService.error('Invalid bill ID');
        this.router.navigate(['/bills']);
      }
    } else {
      console.error('No bill ID in route');
      this.alertService.error('Bill ID is required');
      this.router.navigate(['/bills']);
    }
  }

  loadBill(id: number): void {
    this.loading = true;
    this.bill = null; // Reset bill
    
    this.billingService.getBillById(id).subscribe({
      next: (bill) => {
        this.bill = bill;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.bill = null;
        
        if (err.message === 'Bill not found' || err.status === 404) {
          this.alertService.error('Bill not found');
          // Redirect after a short delay
          setTimeout(() => {
            this.router.navigate(['/bills']);
          }, 2000);
        } else {
          this.alertService.error('Failed to load bill. Please try again.');
        }
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  calculateTotal(bill: Bill): string {
    if (!bill.productItems || bill.productItems.length === 0) return '0.00';
    const total = bill.productItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    return total.toFixed(2);
  }
}

