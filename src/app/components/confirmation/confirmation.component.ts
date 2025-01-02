import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [],
  template: `
    <section class="container mx-auto mt-8 text-center">
      <h2 class="text-3xl font-bold mb-4">Thank you for your order!</h2>
      <p>Your order has been confirmed and is being processed.</p>
    </section>
  `
})
export class ConfirmationComponent {}
