import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  page = input<number>(0);
  currenPage = input<number>(1);

  activePage = linkedSignal(this.currenPage);

  getPagesList = computed(() => {
    return Array.from({length: this.page()}, (_, i) => i + 1)
  })

  goToPage(page: number) {
  if (page < 1 || page > this.page()) return;

  this.activePage.set(page);
}

}
