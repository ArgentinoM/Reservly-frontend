import { Component, inject, output } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Filter } from '../../core/interfaces/filter.interface';
import { CategoriesService } from '../../core/services/categories-service.service';

@Component({
  selector: 'filter-shared',
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
})
export class FilterComponent{

  fb = inject(FormBuilder);
  categoriesService = inject(CategoriesService);

  filterApplied = output<Filter>();

  categoriesResource = rxResource({
    loader: () => (
      this.categoriesService.getCategories()
    )
  })

  filterForm = this.fb.group({
    'category': [null],
    'price_min': [null, [Validators.min(100)]],
    'price_max': [null, [Validators.min(100)]],
    'duration': [null],
    'date': [null],
    'name': [null, [Validators.minLength(6)]]
  })

  hasAnyFilter(): boolean {
    return Object.values(this.filterForm.value).some(value => value !== null);
  }

  onSave(){
    if(this.hasAnyFilter()) {
      this.filterApplied.emit(this.filterForm.value);
    }
  }

  onClear() {

    this.filterForm.reset({
      category: null,
      name: null,
      price_min: null,
      price_max: null,
      duration: null,
      date: null
    });

    this.filterApplied.emit(this.filterForm.value);
  }

}
