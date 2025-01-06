import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, catchError, map, of, tap, withLatestFrom } from 'rxjs';
import * as CartActions from './cart.actions';
import { CartState } from './cart.reducer';
import { selectCartState } from './cart.selectors';

@Injectable()
export class CartEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly snackBar = inject(MatSnackBar);

  private validateCartState(state: CartState | null | undefined): void {
    if (!state) {
      throw new Error('Invalid cart state');
    }
  }

  private validateProductTitle(title: string | undefined | null): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Invalid product title');
    }
  }

  private serializeCartState(state: CartState): string {
    try {
      const serializedState = JSON.stringify(state, (key, value) => {
        if (
          key === 'circular' ||
          (typeof value === 'object' && value !== null && 'circular' in value)
        ) {
          return undefined;
        }
        return value;
      });

      if (!serializedState) {
        throw new Error('Failed to serialize cart state');
      }

      return serializedState;
    } catch (error) {
      console.error('Failed to serialize cart state:', error);
      throw error;
    }
  }

  private saveToLocalStorage(state: CartState): void {
    try {
      this.validateCartState(state);
      const serializedState = this.serializeCartState(state);
      localStorage.setItem('shopping_cart', serializedState);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes('QuotaExceededError') ||
          error.message.includes('Storage full')
        ) {
          console.warn('LocalStorage is full. Consider clearing some space.');
        }
        console.error('Error in saveCart$ effect:', error);
      }
      throw error;
    }
  }

  private showNotification(title: string): void {
    try {
      this.validateProductTitle(title);
      this.snackBar.open(`${title} added to cart`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar', 'above-footer', 'snackbar-centered']
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid product title') {
          console.warn('Product title is invalid. Notification not shown.');
        }
        console.error('Error in showAddToCartNotification$ effect:', error);
      }
      throw error;
    }
  }

  initializeCart$ = createEffect(() =>
    of(true).pipe(
      map(() => {
        try {
          const savedCart = localStorage.getItem('shopping_cart');
          if (savedCart) {
            const cartState: CartState = JSON.parse(savedCart);
            return CartActions.LoadCart({
              items: Object.values(cartState.items).map(item => ({
                id: item.product.id,
                name: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                product: item.product
              }))
            });
          }
          return { type: '[Cart] No Saved Cart Found' };
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          return { type: '[Cart] Load Cart Error' };
        }
      })
    )
  );

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
        tap(([_, state]) => {
          if (!state) {
            throw new Error('Invalid cart state');
          }
          this.saveToLocalStorage(state);
        }),
        catchError(error => {
          console.error('Error in saveCart$ effect:', error);
          return EMPTY;
        })
      ),
    { dispatch: false }
  );

  showAddToCartNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CartActions.AddItem),
        tap(action => {
          if (!action.product) {
            throw new Error('Invalid product');
          }
          this.showNotification(action.product.title);
        }),
        catchError(error => {
          console.error('Error in showAddToCartNotification$ effect:', error);
          return EMPTY;
        })
      ),
    { dispatch: false }
  );
}
