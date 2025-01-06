import { Product } from '../../models/product.model';
import * as CartActions from './cart.actions';

describe('Cart Actions', () => {
  it('should create an action to add an item', () => {
    const product: Product = { id: 1, title: 'Test Product', price: 99.99 };
    const action = CartActions.AddItem({ product });

    expect(action.type).toBe('[Cart] Add Item');
    expect(action.product).toEqual(product);
  });

  it('should create an action to remove a cart item', () => {
    const action = CartActions.RemoveCartItem({ id: 1 });

    expect(action.type).toBe('[Cart] Remove Item');
    expect(action.id).toBe(1);
  });

  it('should create an action to increment item quantity', () => {
    const action = CartActions.IncrementItemQuantity({ id: 1 });

    expect(action.type).toBe('[Cart] Increment Item Quantity');
    expect(action.id).toBe(1);
  });

  it('should create an action to decrement item quantity', () => {
    const action = CartActions.DecrementItemQuantity({ id: 1 });

    expect(action.type).toBe('[Cart] Decrement Item Quantity');
    expect(action.id).toBe(1);
  });

  it('should create an action to load cart', () => {
    const items = [{ id: 1, name: 'Test Product', price: 99.99, quantity: 2 }];
    const action = CartActions.LoadCart({ items });

    expect(action.type).toBe('[Cart] Load Cart');
    expect(action.items).toEqual(items);
  });

  it('should create an action to save cart', () => {
    const items = [{ id: 1, name: 'Test Product', price: 99.99, quantity: 2 }];
    const action = CartActions.SaveCart({ items });

    expect(action.type).toBe('[Cart] Save Cart');
    expect(action.items).toEqual(items);
  });

  it('should create an action to clear the cart', () => {
    const action = CartActions.ClearCart();

    expect(action.type).toBe('[Cart] Clear Cart');
  });

  it('should create an action to apply a promo code', () => {
    const action = CartActions.ApplyPromoCode({ code: 'PROMO123' });

    expect(action.type).toBe('[Cart] Apply Promo Code');
    expect(action.code).toBe('PROMO123');
  });

  it('should create an action to remove a promo code', () => {
    const action = CartActions.RemovePromoCode();

    expect(action.type).toBe('[Cart] Remove Promo Code');
  });

  it('should create an action to update discount', () => {
    const action = CartActions.UpdateDiscount({ discount: 10 });

    expect(action.type).toBe('[Cart] Update Discount');
    expect(action.discount).toBe(10);
  });
});
