import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly cartItems = this.store.selectSignal(selectCartItems);
  protected readonly subtotal = this.store.selectSignal(selectSubtotal);
  protected readonly discount = this.store.selectSignal(selectDiscount);
  protected readonly cartTotal = this.store.selectSignal(selectCartTotal);
  protected readonly isSubmitting = signal(false);

  public readonly checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.minLength(5)]],
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
      nameOnCard: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Format card number as user types
    this.checkoutForm.get('cardNumber')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = value.replace(/\D/g, '').slice(0, 16);
        if (formatted !== value) {
          this.checkoutForm.patchValue(
            { cardNumber: formatted },
            { emitEvent: false }
          );
        }
      }
    });

    // Format expiry date as user types
    this.checkoutForm.get('expiryDate')?.valueChanges.subscribe(value => {
      if (value) {
        let formatted = value.replace(/\D/g, '');
        if (formatted.length >= 2) {
          formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4);
        }
        if (formatted !== value) {
          this.checkoutForm.patchValue(
            { expiryDate: formatted },
            { emitEvent: false }
          );
        }
      }
    });

    // Format CVV as user types
    this.checkoutForm.get('cvv')?.valueChanges.subscribe(value => {
      if (value) {
        const formatted = value.replace(/\D/g, '').slice(0, 4);
        if (formatted !== value) {
          this.checkoutForm.patchValue(
            { cvv: formatted },
            { emitEvent: false }
          );
        }
      }
    });

    // Format ZIP code as user types
    this.checkoutForm.get('zipCode')?.valueChanges.subscribe(value => {
      if (value) {
        let formatted = value.replace(/[^\d-]/g, '');
        if (formatted.length > 5 && !formatted.includes('-')) {
          formatted = formatted.slice(0, 5) + '-' + formatted.slice(5, 9);
        }
        if (formatted !== value) {
          this.checkoutForm.patchValue(
            { zipCode: formatted },
            { emitEvent: false }
          );
        }
      }
    });
  }

  protected async confirmOrder(): Promise<void> {
    if (this.checkoutForm.valid) {
      try {
        this.isSubmitting.set(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Process the order
        this.cartService.clearCart();

        // Show success message
        this.snackBar.open('Order placed successfully!', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });

        // Navigate to confirmation page
        await this.router.navigate(['/confirmation']);
      } catch (error) {
        this.snackBar.open(
          'Failed to place order. Please try again.',
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          }
        );
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.checkoutForm.controls).forEach(key => {
        const control = this.checkoutForm.get(key);
        control?.markAsTouched();
      });

      // Show error message
      this.snackBar.open(
        'Please fill in all required fields correctly.',
        'Close',
        {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        }
      );
    }
  }
}
