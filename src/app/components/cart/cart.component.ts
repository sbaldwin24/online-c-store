import { animate, style, transition, trigger } from '@angular/animations';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, Observable, of, Subject } from 'rxjs';
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
  templateUrl: './cart.component.html',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(20px)' })
        )
      ])
    ]),
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        )
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'translateX(20px)' })
        )
      ])
    ])
  ]
})
export class CartComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private initialized = false;

  cartItems$: Observable<CartItem[]> = this.store
    .select(selectCartItems)
    .pipe(catchError(() => of([])));
  cartTotal$: Observable<number> = this.store
    .select(selectCartTotal)
    .pipe(catchError(() => of(0)));

  ngOnInit(): void {
    if (!this.initialized) {
      try {
        this.cartService.loadCart();
        this.initialized = true;
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  increment(id: number): void {
    try {
      if (this.store?.dispatch) {
        this.store.dispatch(IncrementItemQuantity({ id }));
      }
    } catch (error) {
      console.error('Failed to increment item:', error);
    }
  }

  decrement(id: number): void {
    try {
      if (this.store?.dispatch) {
        this.store.dispatch(DecrementItemQuantity({ id }));
      }
    } catch (error) {
      console.error('Failed to decrement item:', error);
    }
  }

  remove(id: number): void {
    try {
      if (this.store?.dispatch) {
        this.store.dispatch(RemoveCartItem({ id }));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  checkout(): void {
    try {
      if (this.router?.navigate) {
        this.router.navigate(['/checkout']).catch(error => {
          console.error('Navigation failed:', error);
        });
      }
    } catch (error) {
      console.error('Failed to navigate to checkout:', error);
    }
  }
}
