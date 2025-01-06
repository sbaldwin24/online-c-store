import { Product } from '../../models/product.model';
import { CartState } from './cart.reducer';
import {
  selectAppliedPromoCode,
  selectCartItems,
  selectCartState,
  selectCartTotal,
  selectCartTotalQuantity,
  selectDiscount,
  selectSubtotal
} from './cart.selectors';

describe('Cart Selectors', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'Test Description',
    category: 'Test Category',
    images: ['test.jpg'],
    thumbnail: 'thumb.jpg',
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Test Brand'
  };

  const mockProduct2: Product = {
    id: 2,
    title: 'Test Product 2',
    price: 20,
    description: 'Test Description 2',
    category: 'Test Category',
    images: ['test2.jpg'],
    thumbnail: 'thumb2.jpg',
    discountPercentage: 15,
    rating: 4.0,
    stock: 30,
    brand: 'Test Brand'
  };

  const initialState: { cart: CartState } = {
    cart: {
      items: {},
      appliedPromoCode: null,
      discount: 0
    }
  };

  describe('selectCartState', () => {
    it('should select the cart state', () => {
      const result = selectCartState(initialState);
      expect(result).toEqual(initialState.cart);
    });
  });

  describe('selectCartItems', () => {
    it('should return an empty array when there are no items', () => {
      const result = selectCartItems(initialState);
      expect(result).toEqual([]);
    });

    it('should return cart items with correct format', () => {
      const state = {
        cart: {
          items: {
            '1': { product: mockProduct, quantity: 2 },
            '2': { product: mockProduct2, quantity: 1 }
          },
          appliedPromoCode: null,
          discount: 0
        }
      };

      const result = selectCartItems(state);
      expect(result).toEqual([
        { id: 1, name: 'Test Product', price: 10, quantity: 2 },
        { id: 2, name: 'Test Product 2', price: 20, quantity: 1 }
      ]);
    });
  });

  describe('selectCartTotalQuantity', () => {
    it('should return 0 when there are no items', () => {
      const result = selectCartTotalQuantity(initialState);
      expect(result).toBe(0);
    });

    it('should return the total quantity of all items', () => {
      const state = {
        cart: {
          items: {
            '1': { product: mockProduct, quantity: 2 },
            '2': { product: mockProduct2, quantity: 3 }
          },
          appliedPromoCode: null,
          discount: 0
        }
      };

      const result = selectCartTotalQuantity(state);
      expect(result).toBe(5);
    });
  });

  describe('selectSubtotal', () => {
    it('should return 0 when there are no items', () => {
      const result = selectSubtotal(initialState);
      expect(result).toBe(0);
    });

    it('should calculate the correct subtotal', () => {
      const state = {
        cart: {
          items: {
            '1': { product: mockProduct, quantity: 2 }, // 2 * $10 = $20
            '2': { product: mockProduct2, quantity: 3 } // 3 * $20 = $60
          },
          appliedPromoCode: null,
          discount: 0
        }
      };

      const result = selectSubtotal(state);
      expect(result).toBe(80); // $20 + $60 = $80
    });
  });

  describe('selectAppliedPromoCode', () => {
    it('should return null when no promo code is applied', () => {
      const result = selectAppliedPromoCode(initialState);
      expect(result).toBeNull();
    });

    it('should return the applied promo code', () => {
      const state = {
        cart: {
          items: {},
          appliedPromoCode: 'TEST10',
          discount: 0
        }
      };

      const result = selectAppliedPromoCode(state);
      expect(result).toBe('TEST10');
    });
  });

  describe('selectDiscount', () => {
    it('should return 0 when no discount is applied', () => {
      const result = selectDiscount(initialState);
      expect(result).toBe(0);
    });

    it('should return the applied discount amount', () => {
      const state = {
        cart: {
          items: {},
          appliedPromoCode: 'TEST10',
          discount: 10
        }
      };

      const result = selectDiscount(state);
      expect(result).toBe(10);
    });
  });

  describe('selectCartTotal', () => {
    it('should return 0 when there are no items and no discount', () => {
      const result = selectCartTotal(initialState);
      expect(result).toBe(0);
    });

    it('should calculate the correct total with discount', () => {
      const state = {
        cart: {
          items: {
            '1': { product: mockProduct, quantity: 2 }, // 2 * $10 = $20
            '2': { product: mockProduct2, quantity: 3 } // 3 * $20 = $60
          },
          appliedPromoCode: 'TEST10',
          discount: 10
        }
      };

      const result = selectCartTotal(state);
      expect(result).toBe(70); // $80 - $10 = $70
    });

    it('should not allow negative totals', () => {
      const state = {
        cart: {
          items: {
            '1': { product: mockProduct, quantity: 1 } // 1 * $10 = $10
          },
          appliedPromoCode: 'TEST20',
          discount: 20
        }
      };

      const result = selectCartTotal(state);
      expect(result).toBe(0); // $10 - $20 = -$10, but should be $0
    });
  });
});
