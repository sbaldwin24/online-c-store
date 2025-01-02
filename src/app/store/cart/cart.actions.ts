// src/app/store/cart/cart.actions.ts
import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';

export const AddItem = createAction(
  '[Cart] Add Item',
  props<{ product: Product }>()
);
export const RemoveCartItem = createAction(
  '[Cart] Remove Item',
  props<{ id: number }>()
);
export const IncrementItemQuantity = createAction(
  '[Cart] Increment Item Quantity',
  props<{ id: number }>()
);
export const DecrementItemQuantity = createAction(
  '[Cart] Decrement Item Quantity',
  props<{ id: number }>()
);
export const LoadCart = createAction(
  '[Cart] Load Cart',
  props<{ items: CartItem[] }>()
);
export const SaveCart = createAction(
  '[Cart] Save Cart',
  props<{ items: CartItem[] }>()
);
export const ClearCart = createAction('[Cart] Clear Cart');

export const ApplyPromoCode = createAction(
  '[Cart] Apply Promo Code',
  props<{ code: string }>()
);

export const RemovePromoCode = createAction('[Cart] Remove Promo Code');

export const UpdateDiscount = createAction(
  '[Cart] Update Discount',
  props<{ discount: number }>()
);
