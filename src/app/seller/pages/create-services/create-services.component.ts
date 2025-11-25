import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories-service.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatalogService } from '../../../customer/services/catalog.service';
import { ApiResponse, ErrorResponse, MessageResponse } from '../../../core/interfaces/response.interface';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-services',
  imports: [CurrencyPipe, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './create-services.component.html',
})
export class CreateServicesComponent {


  private location = inject(Location);
  private categoriesService = inject(CategoriesService);
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  imgPreview = signal<string | null>(null);
  alertType = signal<'success' | 'error'> ('success');
  alertMessage = signal<string>('')
  alertVisible = signal<boolean>(false);



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
    }).subscribe({
      next: (resp) => {
        this.handleSucces(resp);
      },
      error: (error) => {
        this.handleError(error)
      }
    }
    )

  }

  back(){
    this.location.back()
  }

  private handleSucces<T>(resp : ApiResponse<T> | MessageResponse){
    this.alertVisible.set(true)
    this.alertType.set('success');

    this.alertMessage.set(resp.message);

    setTimeout(() => {
      this.location.back()
    }, 2000);
  }

  private handleError(resp : ErrorResponse){
    this.alertVisible.set(true)
    this.alertType.set('error');
    this.alertMessage.set(resp.error)
  }


}
