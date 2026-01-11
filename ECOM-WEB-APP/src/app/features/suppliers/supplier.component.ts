import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-suppliers',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h2>Suppliers</h2>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="alert alert-info">Loading...</div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let supplier of suppliers">
                <td>{{ supplier.id }}</td>
                <td>{{ supplier.name }}</td>
                <td>{{ supplier.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class SupplierComponent implements OnInit {
    suppliers: any[] = [];
    loading = false;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loading = true;
        this.http.get<any>('http://localhost:8088/api/suppliers').subscribe({
            next: (data) => {
                this.suppliers = data._embedded ? data._embedded.suppliers : [];
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading suppliers', err);
                this.loading = false;
            }
        });
    }
}
