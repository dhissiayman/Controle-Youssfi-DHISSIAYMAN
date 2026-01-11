import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h2>Sales Analytics Dashboard</h2>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="alert alert-info">Loading stats...</div>
          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          
          <div class="row" *ngIf="analyticsData">
            <div class="col-md-6 mb-3" *ngFor="let item of analyticsData | keyvalue">
              <div class="card bg-light">
                <div class="card-body text-center">
                  <h3 class="card-title">{{ item.key }}</h3>
                  <h1 class="display-4 text-primary">{{ item.value }}</h1>
                </div>
              </div>
            </div>
          </div>
          
          <button (click)="loadAnalytics()" class="btn btn-secondary mt-3">Refresh</button>
        </div>
      </div>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  analyticsData: any = null;
  loading = false;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.loading = true;
    this.error = '';
    this.http.get('http://localhost:8088/api/analytics').subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load analytics (Service might be down)';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
