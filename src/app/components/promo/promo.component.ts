import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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

const PROMO_CODES = {
  CHRISTMAS: 'MERRY-CHRISTMAS'
} as const;

const DISCOUNT_RATES = {
  [PROMO_CODES.CHRISTMAS]: 0.1 // 10% discount
} as const;

const SNACKBAR_DURATION = 3000;

interface SnackBarConfig {
  duration: number;
  panelClass: string[];
}

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

  protected readonly promoForm = this.fb.group({
    promoCode: ['', [Validators.required, Validators.minLength(3)]]
  });

  protected readonly appliedPromoCode = this.store.selectSignal(
    selectAppliedPromoCode
  );
  protected readonly subtotal = this.store.selectSignal(selectSubtotal);
  protected readonly discount = this.store.selectSignal(selectDiscount);

  protected readonly isValidPromoCode = computed(() => {
    const code = this.promoForm.get('promoCode')?.value?.toUpperCase() ?? '';
    return Object.values(PROMO_CODES).includes(
      code as (typeof PROMO_CODES)[keyof typeof PROMO_CODES]
    );
  });

  private showSnackBar(message: string, isSuccess: boolean): void {
    const config: SnackBarConfig = {
      duration: SNACKBAR_DURATION,
      panelClass: [isSuccess ? 'success-snackbar' : 'error-snackbar']
    };

    this.snackBar.open(message, 'Close', config);
  }

  protected applyPromo(): void {
    if (this.promoForm.valid) {
      const code = this.promoForm.get('promoCode')?.value?.toUpperCase() ?? '';

      if (this.isValidPromoCode()) {
        const discountRate =
          DISCOUNT_RATES[code as keyof typeof DISCOUNT_RATES];
        const discountAmount = this.subtotal() * discountRate;

        this.store.dispatch(ApplyPromoCode({ code }));
        this.store.dispatch(UpdateDiscount({ discount: discountAmount }));
        this.showSnackBar('Promo code applied successfully!', true);
      } else {
        this.showSnackBar('Invalid promo code', false);
      }

      this.promoForm.reset({ promoCode: '' });
    }
  }

  protected removePromo(): void {
    this.store.dispatch(RemovePromoCode());
  }
}
