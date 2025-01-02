import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CartService } from '../../services/cart.services';
import {
  selectCartItems,
  selectCartTotal,
  selectDiscount,
  selectSubtotal
} from '../../store/cart/cart.selectors';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private formBuilder = inject(FormBuilder);
  private cartService = inject(CartService);
  private router = inject(Router);
  private store = inject(Store);

  cartItems = this.store.selectSignal(selectCartItems);
  subtotal = this.store.selectSignal(selectSubtotal);
  discount = this.store.selectSignal(selectDiscount);
  cartTotal = this.store.selectSignal(selectCartTotal);

  checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]
      ],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      nameOnCard: ['', [Validators.required]]
    });
  }

  confirmOrder(): void {
    if (this.checkoutForm.valid) {
      this.cartService.clearCart();
      this.router.navigate(['/confirmation']);
    }
  }
}
