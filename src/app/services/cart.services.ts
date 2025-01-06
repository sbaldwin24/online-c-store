import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import {
  AddItem,
  ClearCart,
  LoadCart,
  RemoveCartItem
} from '../store/cart/cart.actions';
import { CartState } from '../store/cart/cart.reducer';
import { selectCartItems } from '../store/cart/cart.selectors';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private store = inject(Store);

  loadCart(): void {
    const savedCart = localStorage.getItem('shopping_cart');

    if (savedCart) {
      try {
        const cartState: CartState = JSON.parse(savedCart);
        // Convert the stored cart state back to the expected format
        const items = Object.entries(cartState.items).map(([id, item]) => ({
          id: Number(id),
          name: item.product.title,
          price: item.product.price,
          quantity: item.quantity
        }));
        this.store.dispatch(LoadCart({ items }));
      } catch {
        this.store.dispatch(LoadCart({ items: [] }));
      }
    } else {
      this.store.dispatch(LoadCart({ items: [] }));
    }
  }

  getCartItems(): Observable<CartItem[]> {
    return this.store.select(selectCartItems);
  }

  addToCart(product: Product): void {
    this.store.dispatch(AddItem({ product }));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(RemoveCartItem({ id: productId }));
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity === 0) {
      this.removeFromCart(productId);
    } else {
    }
  }

  clearCart(): Promise<void> {
    this.store.dispatch(ClearCart());
    return Promise.resolve();
  }

  saveCart(items: CartItem[]): void {
    localStorage.setItem('shopping_cart', JSON.stringify(items));
  }
}
