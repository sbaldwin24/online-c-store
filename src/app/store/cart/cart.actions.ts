import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product.model';

export interface CartItemLoad {
  id: number;
  name: string;
  price: number;
  quantity: number;
  product?: Product;
}

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
  props<{ items: CartItemLoad[] }>()
);

export const SaveCart = createAction(
  '[Cart] Save Cart',
  props<{ items: CartItemLoad[] }>()
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
