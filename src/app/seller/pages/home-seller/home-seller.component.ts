import { Component, inject } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CatalogListComponent } from "../../../shared/catalog/catalog-list/catalog-list.component";
import { CatalogComponent } from "../../../shared/catalog/catalog.component";
import { ListServicesPageComponent } from "../../../customer/pages/list-services-page/list-services-page.component";
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../customer/services/catalog.service';

Chart.register(...registerables);


@Component({
  selector: 'app-home-seller',
  imports: [ListServicesPageComponent, RouterLink],
  templateUrl: './home-seller.component.html',
})
export class HomeSellerComponent {

  catalogService = inject(CatalogService);

  salesChart!: Chart;
  revenueChart!: Chart;

  ngAfterViewInit() {
    this.createCharts();
  }

  ngOnDestroy() {
    this.salesChart?.destroy();
    this.revenueChart?.destroy();
  }

 createCharts() {
    this.salesChart = new Chart('salesChart', {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [{
          label: 'Ventas',
          data: [5, 10, 8, 15, 12, 20],
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    this.revenueChart = new Chart('revenueChart', {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
        datasets: [{
          label: 'Ingresos ($)',
          data: [1200, 2500, 1800, 3200, 2800, 4000],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  }
}
