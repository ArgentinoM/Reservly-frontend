import { CurrencyPipe, JsonPipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CatalogListComponent } from "../../../shared/catalog/catalog-list/catalog-list.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../customer/services/catalog.service';
import { tap } from 'rxjs';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { MessageResponse } from '../../../core/interfaces/response.interface';

@Component({
  selector: 'app-create-services',
  imports: [CatalogListComponent ,CurrencyPipe, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './create-services.component.html',
})
export class CreateServicesComponent {


  private location = inject(Location);
  private categoriesService = inject(CategoriesService);
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  imgPreview = signal<string | null>(null);
  message = signal<string | null>(null);
  error = signal<string | null>(null);



  createForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    desc: ['', [Validators.required, Validators.maxLength(255)]],
    price: [null, [Validators.required, Validators.min(200)]],
    duration: [null, [Validators.required, Validators.max(24)]],
    category_id: [0, Validators.required],
    img: this.fb.control<File | null>(null, Validators.required),
  })

  categoriesResoruces = rxResource({
    request: () => ({}),
    loader: () => {
      return this.categoriesService.getCategories();
    }
  })

  onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  console.log(file);

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    console.warn("Archivo demasiado grande");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    this.imgPreview.set(reader.result as string);
  };
  reader.readAsDataURL(file);

  this.createForm.get('img')?.setValue(file);

}

  onSubmit(){
    const { name, desc, price, duration, category_id , img } = this.createForm.value

    this.catalogService.createService({
      name,
      desc,
      price,
      duration,
      category_id,
      img
    }).subscribe((resp) => {
          //   {
    //   next: (resp) => {
    //     this.message.set(resp.message);

    //     // tap(() => {
    //     //   this.location.back
    //     // })
    //   },
    //   error: (err) => {
    //     this.error.set(err.MessageResponse);
    //   }
    }
    )

  }

  back(){
    this.location.back()
  }

}
