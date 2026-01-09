import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Summary, TopServices } from '../../../core/interfaces/seller-dashboard.interface';
import { CatalogService } from '../../../core/services/catalog.service';
import { DashboardService } from '../../../core/services/seller-dashboar.service';
import { ListServicesPageComponent } from "../../../customer/pages/list-services-page/list-services-page.component";
import { SpinerComponent } from "../../../shared/components/spiner/spiner.component";

Chart.register(...registerables);

@Component({
  selector: 'app-home-seller',
  imports: [ListServicesPageComponent, RouterLink, CurrencyPipe, SpinerComponent],
  templateUrl: './home-seller.component.html',
})
export class HomeSellerComponent implements OnInit, OnDestroy {

  catalogService = inject(CatalogService);
  dashboardService = inject(DashboardService);
  authService = inject(AuthService);

  summary = signal<Summary>({
    total_services: 0,
    total_sales: 0,
    total_revenue: 0,
    active_reservations: 0,
  });

  topServices = signal<TopServices[]>([]);

  isLoading = signal(false);

  private salesChart?: Chart;
  private revenueChart?: Chart;

  ngOnInit() {
    this.loadDashboard();
  }

  ngOnDestroy() {
    this.salesChart?.destroy();
    this.revenueChart?.destroy();
  }

  loadDashboard() {
    this.isLoading.set(true);

    forkJoin({
      summary: this.dashboardService.summary(),
      sales: this.dashboardService.salesByMonth(),
      revenue: this.dashboardService.revenueByMonth(),
      topServices: this.dashboardService.topServices()
    }).subscribe({
      next: ({ summary, sales, revenue, topServices }) => {

        this.summary.set(summary);
        this.topServices.set(topServices);

        this.isLoading.set(false);

        setTimeout(() => {
          this.createSalesChart(sales);
          this.createRevenueChart(revenue);
        });

      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  private createSalesChart(res: any) {
    this.salesChart?.destroy();

    this.salesChart = new Chart('salesChart', {
      type: 'bar',
      data: {
        labels: res.labels,
        datasets: [{
          label: 'Ventas',
          data: res.values,
          backgroundColor: 'rgba(59,130,246,.7)',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }

  private createRevenueChart(res: any) {
    this.revenueChart?.destroy();

    this.revenueChart = new Chart('revenueChart', {
      type: 'line',
      data: {
        labels: res.labels,
        datasets: [{
          label: 'Ingresos ($)',
          data: res.values,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,.2)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: '#10b981'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
