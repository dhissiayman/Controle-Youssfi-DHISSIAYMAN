import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingService } from '../../../services/billing.service';
import { Bill } from '../../../models/bill.model';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-header">
      <h1 class="page-title">Bills</h1>
      <button 
        (click)="generateBills()" 
        [disabled]="generating || loading" 
        class="btn btn-success"
        *ngIf="!error">
        {{ generating ? 'Generating...' : '🔄 Generate Bills' }}
      </button>
    </div>

    <div *ngIf="loading" class="spinner-container">
      <div class="spinner"></div>
      <p>Loading bills...</p>
    </div>

    <div *ngIf="!loading && error" class="alert alert-error">
      <p><strong>Erreur:</strong> {{ error }}</p>
      <p style="margin-top: 10px; font-size: 14px;">
        Veuillez vérifier que:
      </p>
      <ul style="text-align: left; display: inline-block; font-size: 14px; margin-top: 10px;">
        <li>Le Gateway Service est démarré (port 8088)</li>
        <li>Le Billing Service est démarré (port 8083)</li>
        <li>Tous les services sont enregistrés dans Eureka (port 8761)</li>
      </ul>
      <p style="margin-top: 10px; font-size: 14px;">
        Vous pouvez également consulter les factures individuelles en saisissant un ID dans l'URL : /bills/{{ '{' }}id{{ '}' }}
      </p>
      <button (click)="loadBills()" class="btn btn-primary" style="margin-top: 10px;">🔄 Réessayer</button>
    </div>

    <div *ngIf="!loading && !error && bills.length === 0" class="empty-state">
      <div class="empty-state-icon">💰</div>
      <h2>Aucune facture trouvée</h2>
      <p>Générez des factures automatiquement pour tous les clients et produits existants.</p>
      <p style="font-size: 14px; color: #7f8c8d; margin-top: 10px;">
        <strong>Pour créer des factures :</strong>
      </p>
      <ol style="text-align: left; display: inline-block; color: #7f8c8d; font-size: 14px;">
        <li>Créez des <a routerLink="/customers" style="color: #3498db;">customers</a> (clients)</li>
        <li>Créez des <a routerLink="/products" style="color: #3498db;">products</a> (produits)</li>
        <li>Cliquez sur <strong>"Generate Bills"</strong> ci-dessus</li>
      </ol>
      <p style="font-size: 12px; color: #95a5a6; margin-top: 15px;">
        Les factures seront créées automatiquement pour chaque client avec tous les produits disponibles.
        <strong>Plus besoin de redémarrer le service !</strong>
      </p>
    </div>

    <div *ngIf="!loading && !error && bills.length > 0" class="card">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Billing Date</th>
            <th>Items</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let bill of bills">
            <td>{{ bill?.id || 'N/A' }}</td>
            <td>
              <span *ngIf="bill?.customer">{{ bill.customer?.name || 'N/A' }}</span>
              <span *ngIf="!bill?.customer">Customer #{{ bill?.customerId || 'N/A' }}</span>
            </td>
            <td>{{ formatDate(bill?.billingDate || '') }}</td>
            <td>{{ bill?.productItems?.length || 0 }}</td>
            <td>{{ '$' + calculateTotal(bill).toFixed(2) }}</td>
            <td>
              <a *ngIf="bill?.id" [routerLink]="['/bills', bill.id]" class="btn btn-primary">View</a>
              <span *ngIf="!bill?.id" class="btn btn-primary" style="opacity: 0.5; cursor: not-allowed;">View</span>
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
      margin-bottom: 10px;
    }

    .spinner-container {
      text-align: center;
      padding: 40px;
    }

    .spinner-container p {
      margin-top: 15px;
      color: #7f8c8d;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class BillListComponent implements OnInit {
  bills: Bill[] = [];
  loading = false;
  generating = false;
  error: string | null = null;

  constructor(
    private billingService: BillingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.loading = true;
    this.error = null; // Clear any previous error
    this.bills = []; // Reset bills array
    
    this.billingService.getAllBills().subscribe({
      next: (response) => {
        console.log('Raw response from API:', response);
        console.log('Response type:', typeof response);
        console.log('Is array?', Array.isArray(response));
        
        // Handle different response types
        let billsArray: Bill[] = [];
        if (Array.isArray(response)) {
          billsArray = response;
        } else if (response && typeof response === 'object') {
          // If response is an object, try to extract array
          // Sometimes Spring wraps responses
          const possibleArray = (response as any)._embedded?.bills || 
                               (response as any).content || 
                               (response as any).data ||
                               [];
          billsArray = Array.isArray(possibleArray) ? possibleArray : [];
        }
        
        // Filter out bills without IDs and log warnings
        this.bills = billsArray.filter(bill => {
          if (!bill || bill.id === undefined || bill.id === null) {
            console.warn('Bill without ID found:', bill);
            return false;
          }
          return true;
        });
        
        this.loading = false;
        this.error = null; // Clear error on success
        console.log('Bills loaded:', this.bills.length, 'valid bills');
        console.log('Bills array:', this.bills);
        
        if (billsArray.length > this.bills.length) {
          console.warn(`Filtered out ${billsArray.length - this.bills.length} bills without IDs`);
        }
      },
      error: (err) => {
        this.loading = false;
        this.bills = []; // Ensure bills is empty array on error
        console.error('Error loading bills:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error,
          url: err.url
        });
        
        // Set error message based on status
        if (err.status === 404) {
          this.error = 'Bills endpoint not found. Please check that the billing service is running.';
        } else if (err.status === 0) {
          this.error = 'Cannot connect to billing service. Please ensure all backend services are running.';
        } else if (err.status === 503) {
          this.error = 'Service unavailable. The billing service is not available. Please check that all services are running and registered in Eureka.';
        } else {
          this.error = `Failed to load bills (Error ${err.status}). Please check the backend services.`;
        }
        this.alertService.error('Failed to load bills');
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  calculateTotal(bill: Bill | null | undefined): number {
    if (!bill || !bill.productItems || bill.productItems.length === 0) return 0;
    const total = bill.productItems.reduce((sum, item) => {
      const price = item?.unitPrice || 0;
      const qty = item?.quantity || 0;
      return sum + (price * qty);
    }, 0);
    return total;
  }

  /**
   * Generate bills for all customers
   * No need to restart the billing service!
   */
  generateBills(): void {
    if (this.generating) return;
    
    if (!confirm('Générer des factures pour tous les clients existants avec tous les produits disponibles ?')) {
      return;
    }

    this.generating = true;
    this.billingService.generateBills().subscribe({
      next: (response) => {
        this.generating = false;
        console.log('Generate bills response:', response);
        
        if (response && response.success) {
          const message = response.billsCreated > 0 
            ? `✅ ${response.billsCreated} facture(s) créée(s) avec succès! Total: ${response.totalBills || 0} facture(s)`
            : `ℹ️ Aucune nouvelle facture créée. ${response.totalBills || 0} facture(s) existante(s) déjà.`;
          this.alertService.success(message);
          // Reload bills list after a short delay to ensure backend is ready
          setTimeout(() => {
            this.loadBills();
          }, 500);
        } else {
          const message = response?.message || 'Erreur lors de la génération des factures';
          this.alertService.error(message);
        }
      },
      error: (err) => {
        this.generating = false;
        console.error('Error generating bills:', err);
        console.error('Error details:', {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          error: err.error
        });
        
        let errorMessage = 'Erreur lors de la génération des factures';
        
        if (err.status === 0) {
          errorMessage = `Impossible de se connecter au serveur. Vérifiez que:
1. Le Gateway Service est démarré (port 8088)
2. Le Billing Service est démarré (port 8083)
3. Les services sont enregistrés dans Eureka (port 8761)`;
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 404) {
          errorMessage = 'Endpoint /api/bills/generate non trouvé. Vérifiez que le Billing Service est démarré et enregistré dans Eureka.';
        } else {
          errorMessage = `Erreur ${err.status}: ${err.statusText || 'Erreur inconnue'}`;
        }
        
        this.alertService.error(errorMessage);
      }
    });
  }
}

