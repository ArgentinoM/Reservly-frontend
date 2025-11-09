import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../core/services/categories-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Filter } from './filter.interface';

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
    'category': [0, ],
    'price_min': [0, [Validators.min(100)]],
    'price_max': [0, [Validators.min(100)]],
    'duration': [''],
    'date': ['',],
    'name': ['', [Validators.minLength(6)]]
  })

  onSave(){
    // if (this.filterForm.invalid) {
    //   this.filterForm.markAllAsTouched();
    //   return;
    // }

    console.log(this.filterForm.value.category);

    this.filterApplied.emit(this.filterForm.value);
  }

}
