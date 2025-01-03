import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.services';
import {
  DecrementItemQuantity,
  IncrementItemQuantity,
  RemoveCartItem
} from '../../store/cart/cart.actions';
import {
  selectCartItems,
  selectCartTotal
} from '../../store/cart/cart.selectors';
import { PromoComponent } from '../promo/promo.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CommonModule, PromoComponent, RouterLink],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  increment(id: number): void {
    this.store.dispatch(IncrementItemQuantity({ id }));
  }

  decrement(id: number): void {
    this.store.dispatch(DecrementItemQuantity({ id }));
  }

  remove(id: number): void {
    this.store.dispatch(RemoveCartItem({ id }));
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
