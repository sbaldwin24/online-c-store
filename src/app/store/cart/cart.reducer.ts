import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import {
  AddItem,
  ApplyPromoCode,
  ClearCart,
  DecrementItemQuantity,
  IncrementItemQuantity,
  LoadCart,
  RemoveCartItem,
  RemovePromoCode,
  UpdateDiscount
} from './cart.actions';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: Record<number, CartItem>;
  appliedPromoCode: string | null;
  discount: number;
}

export const initialState: CartState = {
  items: {},
  appliedPromoCode: null,
  discount: 0
};

export const cartReducer = createReducer(
  initialState,
  on(AddItem, (state, { product }) => ({
    ...state,
    items: {
      ...state.items,
      [product.id]: state.items[product.id]
        ? {
            ...state.items[product.id],
            quantity: state.items[product.id].quantity + 1
          }
        : { product, quantity: 1 }
    }
  })),
  on(RemoveCartItem, (state, { id }) => {
    const { [id]: removed, ...items } = state.items;
    return { ...state, items };
  }),
  on(IncrementItemQuantity, (state, { id }) => ({
    ...state,
    items: {
      ...state.items,
      [id]: { ...state.items[id], quantity: state.items[id].quantity + 1 }
    }
  })),
  on(DecrementItemQuantity, (state, { id }) => ({
    ...state,
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        quantity: Math.max(0, state.items[id].quantity - 1)
      }
    }
  })),
  on(ClearCart, () => initialState),
  on(ApplyPromoCode, (state, { code }) => ({
    ...state,
    appliedPromoCode: code
  })),
  on(RemovePromoCode, state => ({
    ...state,
    appliedPromoCode: null,
    discount: 0
  })),
  on(UpdateDiscount, (state, { discount }) => ({
    ...state,
    discount
  })),
  on(LoadCart, (state, { items }) => {
    const newItems = items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          product: {
            id: item.id,
            title: item.name,
            price: item.price,
            description: '',
            category: '',
            thumbnail: '',
            images: [],
            brand: '',
            rating: 0,
            stock: 0,
            discountPercentage: 0,
            ...item.product
          },
          quantity: item.quantity
        }
      }),
      {}
    );

    return {
      ...state,
      items: newItems,
      appliedPromoCode: state.appliedPromoCode,
      discount: state.discount
    };
  })
);
