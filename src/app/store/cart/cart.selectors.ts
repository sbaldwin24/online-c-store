import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(selectCartState, state =>
  Object.entries(state.items).map(([id, item]) => ({
    id: Number(id),
    name: item.product.title,
    price: item.product.price,
    quantity: item.quantity
  }))
);

export const selectCartTotalQuantity = createSelector(selectCartState, state =>
  Object.values(state.items).reduce((total, item) => total + item.quantity, 0)
);

export const selectSubtotal = createSelector(selectCartState, state =>
  Object.values(state.items).reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )
);

export const selectAppliedPromoCode = createSelector(
  selectCartState,
  state => state.appliedPromoCode
);

export const selectDiscount = createSelector(
  selectCartState,
  state => state.discount
);

export const selectCartTotal = createSelector(
  selectSubtotal,
  selectDiscount,
  (subtotal, discount) => subtotal - discount
);
