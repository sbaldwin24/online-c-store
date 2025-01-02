import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import * as CartActions from './cart.actions';
import { selectCartState } from './cart.selectors';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  saveCart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CartActions.AddItem,
          CartActions.RemoveCartItem,
          CartActions.IncrementItemQuantity,
          CartActions.DecrementItemQuantity,
          CartActions.ClearCart,
          CartActions.ApplyPromoCode,
          CartActions.RemovePromoCode,
          CartActions.UpdateDiscount
        ),
        withLatestFrom(this.store.select(selectCartState)),
        tap(([_, cartState]) => {
          localStorage.setItem('shopping_cart', JSON.stringify(cartState));
        })
      ),
    { dispatch: false }
  );

  showAddToCartNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.AddItem),
        tap(({ product }) => {
          this.snackBar.open(`${product.title} added to cart`, 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: [
              'success-snackbar',
              'above-footer',
              'snackbar-centered'
            ]
          });
        })
      ),
    { dispatch: false }
  );
}
