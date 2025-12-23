import { CurrencyPipe, Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { CreateUpdateOptions } from '../../../core/interfaces/CreateUpdateOptions.interfaces';
import { ApiResponse, ErrorResponse, MessageResponse } from '../../../core/interfaces/response.interface';
import { CatalogService } from '../../../core/services/catalog.service';
import { CategoriesService } from '../../../core/services/categories-service.service';
import { NotificationsComponent } from "../../../shared/components/notifications/notifications.component";
import { SpinerComponent } from "../../../shared/components/spiner/spiner.component";

@Component({
  selector: 'app-create-services',
  imports: [CurrencyPipe, ReactiveFormsModule, NotificationsComponent, SpinerComponent],
  templateUrl: './createUpdate-services.component.html',
})
export class CreateUpdateServicesComponent {
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.serviceId.set(+id);
      this.loadService(+id);
    }
  }


  private location = inject(Location);
  private categoriesService = inject(CategoriesService);
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  isEditMode = signal(false);
  serviceId = signal<number | null>(null);

  isLoading = signal(false);


  imgPreview = signal<string | null>(null);
  alertType = signal<'success' | 'error'> ('success');
  alertMessage = signal<string>('')
  alertVisible = signal<boolean>(false);



  FormActions = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    desc: ['', [Validators.required, Validators.maxLength(255)]],
    price: [0, [Validators.required, Validators.min(200)]],
    duration: [0, [Validators.required, Validators.max(24)]],
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


    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    this.FormActions.get('img')?.setValue(file);

  }

  onSubmit() {
    if (this.isEditMode()) {
      this.updateService();
    } else {
      this.createService();
    }
  }


  createService(){
    const { name, desc, price, duration, category_id , img } = this.FormActions.value;

      this.isLoading.set(true);


    this.catalogService.createService({
      name,
      desc,
      price,
      duration,
      category_id,
      img
    }).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (resp) => {

        this.handleSucces(resp);
      },
      error: (error) => {
        this.handleError(error)
      }
    }
    )

  }

  updateService() {
    if (!this.serviceId()) return;

    const changes = this.getChangedValues();

    if (Object.keys(changes).length === 0) {
      this.alertVisible.set(true);
      this.alertType.set('error');
      this.alertMessage.set('No se realizaron cambios');
      return;
    }

    this.isLoading.set(true);

    let payload: CreateUpdateOptions | FormData = changes;

    if (changes.img) {
      const formData = new FormData();
      Object.entries(changes).forEach(([key, value]) => {
        formData.append(key, value as any);
      });
      payload = formData;
    }

    this.catalogService.updateService(
      this.serviceId()!,
      payload
    ).pipe(
      finalize(() => this.isLoading.set(false))
    ).subscribe({
      next: (resp) => this.handleSucces(resp),
      error: (error) => this.handleError(error)
    });
  }

  loadService(id: number) {
    this.catalogService.getServicesById(id).subscribe(resp => {
      const service = resp.data;

      console.log(service);

      this.FormActions.patchValue({
        name: service.name,
        desc: service.desc,
        price: service.price,
        duration: service.duration,
        category_id: service.category,
      });

      this.imgPreview.set(service.img);
    });
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


  private getChangedValues(): CreateUpdateOptions {
    const changed: Record<string, any> = {};

    Object.keys(this.FormActions.controls).forEach((key) => {
      const control = this.FormActions.get(key);

      if (key === 'img' && control?.value instanceof File) {
        changed[key] = control.value;
        return;
      }

      if (control?.dirty) {
        changed[key] = control.value;
      }
    });

    return changed;
  }

}
