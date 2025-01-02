import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { combineLatest } from 'rxjs';
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
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      quantity: 2
    }
  ];

  const initialState = {
    cart: {
      items: mockCartItems,
      totalQuantity: 2,
      subtotal: 199.98,
      discount: 0,
      total: 199.98
    }
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    cartService = jasmine.createSpyObj('CartService', ['loadCart']);

    await TestBed.configureTestingModule({
      imports: [CartComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectCartItems, value: mockCartItems },
            { selector: selectCartTotal, value: 199.98 }
          ]
        }),
        { provide: Router, useValue: router },
        { provide: CartService, useValue: cartService }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    expect(cartService.loadCart).toHaveBeenCalled();
  });

  it('should display cart items', done => {
    component.cartItems$.subscribe(items => {
      expect(items).toEqual(mockCartItems);
      done();
    });
  });

  it('should display cart total', done => {
    component.cartTotal$.subscribe(total => {
      expect(total).toBe(199.98);
      done();
    });
  });

  it('should increment item quantity', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.increment(1);
    expect(dispatchSpy).toHaveBeenCalledWith(IncrementItemQuantity({ id: 1 }));
  });

  it('should decrement item quantity', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.decrement(1);
    expect(dispatchSpy).toHaveBeenCalledWith(DecrementItemQuantity({ id: 1 }));
  });

  it('should remove item from cart', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.remove(1);
    expect(dispatchSpy).toHaveBeenCalledWith(RemoveCartItem({ id: 1 }));
  });

  it('should navigate to checkout', () => {
    component.checkout();
    expect(router.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should update when cart items change', done => {
    const newCartItems = [
      ...mockCartItems,
      {
        id: 2,
        name: 'Another Product',
        price: 49.99,
        quantity: 1
      }
    ];

    store.overrideSelector(selectCartItems, newCartItems);
    store.overrideSelector(selectCartTotal, 249.97);
    store.refreshState();

    component.cartItems$.subscribe(items => {
      expect(items).toEqual(newCartItems);
      done();
    });
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should handle empty cart', done => {
    store.overrideSelector(selectCartItems, []);
    store.overrideSelector(selectCartTotal, 0);
    store.refreshState();

    combineLatest([component.cartItems$, component.cartTotal$]).subscribe({
      next: ([items, total]) => {
        expect(items).toEqual([]);
        expect(total).toBe(0);
        done();
      }
    });
  });
});
