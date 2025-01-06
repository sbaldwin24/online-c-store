import { Product } from '../../models/product.model';
import * as CartActions from './cart.actions';
import { CartState, cartReducer, initialState } from './cart.reducer';

describe('Cart Reducer', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 100,
    brand: 'Test Brand',
    category: 'electronics',
    thumbnail: 'test-thumbnail.jpg',
    images: ['test-image-1.jpg', 'test-image-2.jpg']
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'UNKNOWN' };
      const state = cartReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('AddItem action', () => {
    it('should add new item to empty cart', () => {
      const action = CartActions.AddItem({ product: mockProduct });
      const state = cartReducer(initialState, action);

      expect(state.items[mockProduct.id]).toEqual({
        product: mockProduct,
        quantity: 1
      });
    });

    it('should increment quantity for existing item', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 1 }
        },
        appliedPromoCode: null,
        discount: 0
      };

      const action = CartActions.AddItem({ product: mockProduct });
      const state = cartReducer(existingState, action);

      expect(state.items[mockProduct.id].quantity).toBe(2);
    });
  });

  describe('RemoveCartItem action', () => {
    it('should remove item from cart', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 1 }
        },
        appliedPromoCode: null,
        discount: 0
      };

      const action = CartActions.RemoveCartItem({ id: mockProduct.id });
      const state = cartReducer(existingState, action);

      expect(state.items[mockProduct.id]).toBeUndefined();
    });

    it('should handle removing non-existent item', () => {
      const action = CartActions.RemoveCartItem({ id: 999 });
      const state = cartReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('IncrementItemQuantity action', () => {
    it('should increment item quantity', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 1 }
        },
        appliedPromoCode: null,
        discount: 0
      };

      const action = CartActions.IncrementItemQuantity({ id: mockProduct.id });
      const state = cartReducer(existingState, action);

      expect(state.items[mockProduct.id].quantity).toBe(2);
    });

    it('should handle incrementing non-existent item', () => {
      const action = CartActions.IncrementItemQuantity({ id: 999 });
      const state = cartReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('DecrementItemQuantity action', () => {
    it('should decrement item quantity', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 2 }
        },
        appliedPromoCode: null,
        discount: 0
      };

      const action = CartActions.DecrementItemQuantity({ id: mockProduct.id });
      const state = cartReducer(existingState, action);

      expect(state.items[mockProduct.id].quantity).toBe(1);
    });

    it('should not decrement below 0', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 0 }
        },
        appliedPromoCode: null,
        discount: 0
      };

      const action = CartActions.DecrementItemQuantity({ id: mockProduct.id });
      const state = cartReducer(existingState, action);

      expect(state.items[mockProduct.id].quantity).toBe(0);
    });

    it('should handle decrementing non-existent item', () => {
      const action = CartActions.DecrementItemQuantity({ id: 999 });
      const state = cartReducer(initialState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ClearCart action', () => {
    it('should clear all items from cart', () => {
      const existingState: CartState = {
        items: {
          [mockProduct.id]: { product: mockProduct, quantity: 2 }
        },
        appliedPromoCode: 'SAVE10',
        discount: 10
      };

      const action = CartActions.ClearCart();
      const state = cartReducer(existingState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('ApplyPromoCode action', () => {
    it('should apply promo code', () => {
      const action = CartActions.ApplyPromoCode({ code: 'SAVE10' });
      const state = cartReducer(initialState, action);

      expect(state.appliedPromoCode).toBe('SAVE10');
    });
  });

  describe('RemovePromoCode action', () => {
    it('should remove promo code and reset discount', () => {
      const existingState: CartState = {
        items: {},
        appliedPromoCode: 'SAVE10',
        discount: 10
      };

      const action = CartActions.RemovePromoCode();
      const state = cartReducer(existingState, action);

      expect(state.appliedPromoCode).toBeNull();
      expect(state.discount).toBe(0);
    });
  });

  describe('UpdateDiscount action', () => {
    it('should update discount amount', () => {
      const action = CartActions.UpdateDiscount({ discount: 10 });
      const state = cartReducer(initialState, action);

      expect(state.discount).toBe(10);
    });
  });

  describe('LoadCart action', () => {
    it('should load cart items', () => {
      const cartItems = [
        {
          id: mockProduct.id,
          name: mockProduct.title,
          price: mockProduct.price,
          quantity: 2
        }
      ];

      const action = CartActions.LoadCart({ items: cartItems });
      const state = cartReducer(initialState, action);

      expect(state.items[mockProduct.id]).toEqual({
        product: {
          id: mockProduct.id,
          title: mockProduct.title,
          price: mockProduct.price,
          description: 'Test Description',
          discountPercentage: 10,
          rating: 4.5,
          stock: 100,
          brand: 'Test Brand',
          category: 'electronics',
          thumbnail: 'test-thumbnail.jpg',
          images: ['test-image-1.jpg', 'test-image-2.jpg']
        },
        quantity: 2
      });
    });

    it('should handle loading empty cart', () => {
      const action = CartActions.LoadCart({ items: [] });
      const state = cartReducer(initialState, action);

      expect(state.items).toEqual({});
    });
  });
});
