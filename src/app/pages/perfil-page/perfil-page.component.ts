import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { ApiResponse, ErrorResponse, MessageResponse } from '../../core/interfaces/response.interface';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { SpinerComponent } from "../../shared/components/spiner/spiner.component";
import { FormErrorService } from '../../shared/services/from-error.service';

@Component({
  selector: 'app-perfil-page',
  imports: [ReactiveFormsModule, SpinerComponent, NotificationsComponent],
  templateUrl: './perfil-page.component.html',
})
export class PerfilPageComponent implements OnInit {

  private authService = inject(AuthService);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private formErrorService = inject(FormErrorService);

  user = computed(() => this.authService.user());

  showEditModal = false;
  editForm!: FormGroup;

  isLoading = signal(false);
  alertType = signal<'success' | 'error'>('success');
  alertMessage = signal<string>('');
  alertVisible = signal<boolean>(false);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.editForm = this.fb.group({
      name: [this.user()?.name, [Validators.maxLength(50)]],
      surname: [this.user()?.surname, [Validators.maxLength(100)]],
      phone: [this.user()?.phone, [Validators.pattern('^[0-9]*$') ,Validators.minLength(10),Validators.maxLength(10)]],
      bio: [this.user()?.bio, [Validators.maxLength(255)]],
      img_perfil: this.fb.control<File | null>(null),
    });
  }

  openModal() {
    this.initForm();
    this.showEditModal = true;
  }

  closeModal() {
    this.showEditModal = false;
  }

  submit() {
    if (this.editForm.invalid) {
      this.alertVisible.set(true);
      this.alertType.set('error');
      this.alertMessage.set(this.getErrorMessage());
      return;
    }

    const data = this.editForm.value;
    this.isLoading.set(true);

    this.authService.updateUser(data).subscribe({
      next: (resp) => this.handleSuccess(resp),
      error: (err) => this.handleError(err),
      complete: () => this.isLoading.set(false)
    });
  }

  onFileSelected(event: Event) {

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    this.editForm.get('img_perfil')?.setValue(file);

  }

  get imgPerfilLabel(): string {
    const file: File | null = this.editForm?.get('img_perfil')?.value ?? null;
    return file ? file.name : 'Subir foto';
  }

  goBack() {
    this.location.back();
  }


  private handleSuccess<T extends { message: string }>(resp: ApiResponse<T> | MessageResponse) {
    this.showAlert('success', resp.message);
    this.closeModal();
  }


  private handleError(resp: ErrorResponse) {
    this.showAlert('error', resp.error);
  }

  private showAlert(type: 'success' | 'error', message: string) {
    this.alertType.set(type);
    this.alertMessage.set(message);
    this.isLoading.set(false);
    this.alertVisible.set(true);
  }

  private readonly fromErrors: Record<string, Record<string, string>> = {
    name: {
      maxlength: 'El nombre no puede tener más de 50 caracteres',
    },
    surname: {
      maxlength: 'El apellido no puede tener más de 100 caracteres',
    },
    phone: {
      maxlength: 'El teléfono no puede tener más de 10 caracteres',
      minlength: 'El teléfono debe tener al menos 10 caracteres',
      pattern: 'El teléfono solo puede contener números',
    },
    bio: {
      maxlength: 'La bio no puede tener más de 255 caracteres',
    }
  }

  private getErrorMessage(): string {

    return this.formErrorService.getErrorMessage(
      this.editForm.controls,
      this.fromErrors
    );

  }
}
