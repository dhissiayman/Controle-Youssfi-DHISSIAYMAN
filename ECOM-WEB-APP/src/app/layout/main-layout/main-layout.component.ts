import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="main-layout">
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <a routerLink="/customers" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
            👥 Customers
          </a>
          <a routerLink="/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
            📦 Products
          </a>
          <a routerLink="/bills" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
            💰 Bills
          </a>
        </nav>
      </aside>
      <main class="main-content">
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 250px;
      background-color: #34495e;
      color: white;
      padding: 20px 0;
      box-shadow: 2px 0 4px rgba(0,0,0,0.1);
    }

    .sidebar-nav {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .sidebar-nav a {
      display: block;
      color: white;
      text-decoration: none;
      padding: 12px 20px;
      transition: background-color 0.3s;
      border-left: 3px solid transparent;
    }

    .sidebar-nav a:hover {
      background-color: #2c3e50;
      border-left-color: #3498db;
    }

    .sidebar-nav a.active {
      background-color: #2c3e50;
      border-left-color: #3498db;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      padding: 20px;
      background-color: #f5f5f5;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .main-layout {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
        padding: 10px 0;
      }

      .sidebar-nav {
        display: flex;
        overflow-x: auto;
      }

      .sidebar-nav a {
        white-space: nowrap;
        padding: 10px 15px;
      }
    }
  `]
})
export class MainLayoutComponent {
  constructor(public router: Router) {}
}

