import { Location } from '@angular/common';
import { AfterViewInit, Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { PaymentsData } from '../../core/interfaces/paymentsData';
import { ApiResponse, ErrorResponse, MessageResponse } from '../../core/interfaces/response.interface';
import { PaymentsService } from '../../core/services/payments.services';
import { NotificationsComponent } from "../../shared/components/notifications/notifications.component";
import { SpinerComponent } from "../../shared/components/spiner/spiner.component";

@Component({
  selector: 'app-payments',
  imports: [SpinerComponent, NotificationsComponent],
  templateUrl: './payments.component.html',
})

export class PaymentsComponent implements AfterViewInit{

  paymentService = inject(PaymentsService);
  location = inject(Location);
  router = inject(Router);

  service_id = signal(history.state.serviceId);
  start_date = signal(history.state.startDate);
  end_date = signal(history.state.endDate);

  isLoading = signal(false);
  alertType = signal<'success' | 'error'>('success');
  alertMessage = signal<string>('');
  alertVisible = signal<boolean>(false);

  stripe = signal<Stripe | null>(null);
  elements = signal<StripeElements | null>(null);
  paymentInProgress = signal(true);
  clientSecret = signal<string>(this.paymentService.clientSecret());
  reservationId = signal<number>(history.state.reservationId);

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent) {
    if (this.paymentInProgress()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  canExit(): boolean {

    if (!this.paymentInProgress()) return true;

    return confirm(
      'El proceso de pago aún no ha finalizado.\n' +
      'Si sales ahora, tu reservación quedará pendiente.\n\n' +
      '¿Deseas continuar?'
    );
  }

  async ngAfterViewInit() {
    const stripeInstance = await loadStripe(environment.stripe_pk);
    if (!stripeInstance) return;

    this.stripe.set(stripeInstance);

    if(this.reservationId()){
      this.initContinuePayment(stripeInstance);
      return
    }

    this.initCreatePayment(stripeInstance);
  }

  initContinuePayment(stripe: Stripe) {
    this.isLoading.set(true);

    this.paymentService.continuePayment(this.reservationId()!).subscribe({
      next: (resp) => {
        this.mountElements(stripe, resp.client_secret);
      },
      error: (err) => {
        this.showAlert('error', err.error || 'No se pudo continuar el pago');
        this.exit()
      },
      complete: () => this.isLoading.set(false)
    });
  }

  initCreatePayment(stripe: Stripe) {
    this.isLoading.set(true);

    const data: PaymentsData = {
      service_id: this.service_id()!,
      start_date: this.start_date()!,
      end_date: this.end_date()!,
    };

    this.paymentService.createPaymentIntent(data).subscribe({
      next: (resp) => {
        this.mountElements(stripe, resp.client_secret);
      },
      error: (err) => {
        this.showAlert('error', err.error || 'No se pudo crear el pago');
        this.exit();
      },
      complete: () => this.isLoading.set(false)
    });
  }

  checkStatus() {
    const id = this.reservationId();
    if (!id) return;

    const intervalId = setInterval(() => {

        this.paymentService.getReservationStatus(id).subscribe(({message}) => {

          if (message === 'pendiente') {

            clearInterval(intervalId);

          }
        });

      }, 2000);
  }

  mountElements(stripe: Stripe, clientSecret: string) {
    const elements = stripe.elements({ clientSecret });
    this.elements.set(elements);

    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
  }

  async pay() {
    const stripe = this.stripe();
    const elements = this.elements();

    if (!stripe || !elements) return;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      return;
    }

    if (paymentIntent?.status === 'succeeded') {

      this.paymentInProgress.set(false)

      if(this.reservationId()){
        this.paymentService.markReservationAsPaid(this.reservationId()!)
      }

      this.handleSuccess('Se realizo su pago correctamente');

      // this.checkStatus();

      setTimeout(() => {

        this.router.navigateByUrl('/customer/reservations')

      }, 500);
    }
  }

  goBack() {
    this.location.back();
  }

  private handleSuccess<T extends { message: string }>(resp: ApiResponse<T> | MessageResponse | string) {
    const message =
    typeof resp === 'string'
      ? resp
      : resp.message;

    this.showAlert('success', message);
  }

  private exit() {
    setTimeout(() => {
      this.router.navigateByUrl('/customer/reservations');
    }, 3000);
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

}
