import { Location } from '@angular/common';
import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { PaymentsData } from '../../core/interfaces/paymentsData';
import { PaymentsService } from '../../core/services/payments.services';
import { SpinerComponent } from "../../shared/components/spiner/spiner.component";

@Component({
  selector: 'app-payments',
  imports: [SpinerComponent],
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

  stripe = signal<Stripe | null>(null);
  elements = signal<StripeElements | null>(null);
  clientSecret = signal<string>(this.paymentService.clientSecret());

  async ngAfterViewInit() {
     await this.initStripe();
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
      console.error(error.message);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      console.log('Pago exitoso 🎉', paymentIntent);
    }
  }

  async initStripe() {
    const stripeInstance = await loadStripe(environment.stripe_pk);
    if (!stripeInstance) return;

    this.stripe.set(stripeInstance);

    const data: PaymentsData = {
      service_id: this.service_id(),
      start_date: this.start_date(),
      end_date: this.end_date(),
    };

    this.isLoading.set(true);

    this.paymentService.createPaymentIntent(data).subscribe({
      next: (response) => {

        const elements = stripeInstance.elements({
          clientSecret: response.client_secret,
        });

        this.elements.set(elements);

        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');
      },
      error: (err) => {
        console.error('Error creating payment intent:', err);
        this.router.navigate(['/']);

      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  goBack(){
    this.location.back();
  }

}
