import { CanDeactivateFn } from '@angular/router';

export interface PaymentExitGuard {
  canExit: () => boolean;
}

export const paymentExitGuard: CanDeactivateFn<PaymentExitGuard> =
  (component) => component.canExit();
