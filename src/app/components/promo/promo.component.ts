import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import {
  ApplyPromoCode,
  RemovePromoCode,
  UpdateDiscount
} from '../../store/cart/cart.actions';
import {
  selectAppliedPromoCode,
  selectDiscount,
  selectSubtotal
} from '../../store/cart/cart.selectors';

@Component({
  selector: 'app-promo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './promo.component.html'
})
export class PromoComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  promoForm = this.fb.group({
    promoCode: ['', Validators.required]
  });

  appliedPromoCode = this.store.selectSignal(selectAppliedPromoCode);
  subtotal = this.store.selectSignal(selectSubtotal);
  discount = this.store.selectSignal(selectDiscount);

  applyPromo(): void {
    if (this.promoForm.valid) {
      const code = this.promoForm.get('promoCode')?.value?.toUpperCase();
      if (code === 'MERRY-CHRISTMAS') {
        const discountAmount = this.subtotal() * 0.1; // 10% discount
        this.store.dispatch(ApplyPromoCode({ code }));
        this.store.dispatch(UpdateDiscount({ discount: discountAmount }));
        this.snackBar.open('Promo code applied successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.snackBar.open('Invalid promo code', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
      this.promoForm.reset({ promoCode: '' });
    }
  }

  removePromo(): void {
    this.store.dispatch(RemovePromoCode());
  }
}
