import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.services';
import {
  DecrementItemQuantity,
  IncrementItemQuantity,
  RemoveCartItem
} from '../../store/cart/cart.actions';
import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockCartItems: CartItem[] = [
    { id: 1, name: 'Test Product 1', price: 10, quantity: 2 },
    { id: 2, name: 'Test Product 2', price: 20, quantity: 1 }
  ];

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['loadCart']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, BrowserAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: Router, useValue: routerSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    // Set up default store selectors
    store.overrideSelector('selectCartItems', mockCartItems);
    store.overrideSelector('selectCartTotal', 40);
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load cart on init', () => {
      component.ngOnInit();
      expect(cartService.loadCart).toHaveBeenCalled();
    });

    it('should handle error when loading cart fails', () => {
      cartService.loadCart.and.throwError('Failed to load cart');
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load cart:',
        jasmine.any(Error)
      );
    });

    it('should not load cart twice if already initialized', () => {
      component.ngOnInit();
      component.ngOnInit();
      expect(cartService.loadCart).toHaveBeenCalledTimes(1);
    });
  });

  describe('cart operations', () => {
    it('should increment item quantity', () => {
      spyOn(store, 'dispatch');
      component.increment(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        IncrementItemQuantity({ id: 1 })
      );
    });

    it('should handle error when incrementing fails', () => {
      spyOn(store, 'dispatch').and.throwError('Failed to increment');
      spyOn(console, 'error');

      component.increment(1);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to increment item:',
        jasmine.any(Error)
      );
    });

    it('should decrement item quantity', () => {
      spyOn(store, 'dispatch');
      component.decrement(1);
      expect(store.dispatch).toHaveBeenCalledWith(
        DecrementItemQuantity({ id: 1 })
      );
    });

    it('should handle error when decrementing fails', () => {
      spyOn(store, 'dispatch').and.throwError('Failed to decrement');
      spyOn(console, 'error');

      component.decrement(1);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to decrement item:',
        jasmine.any(Error)
      );
    });

    it('should remove item from cart', () => {
      spyOn(store, 'dispatch');
      component.remove(1);
      expect(store.dispatch).toHaveBeenCalledWith(RemoveCartItem({ id: 1 }));
    });

    it('should handle error when removing item fails', () => {
      spyOn(store, 'dispatch').and.throwError('Failed to remove');
      spyOn(console, 'error');

      component.remove(1);

      expect(console.error).toHaveBeenCalledWith(
        'Failed to remove item:',
        jasmine.any(Error)
      );
    });
  });

  describe('checkout', () => {
    it('should navigate to checkout page', () => {
      router.navigate.and.returnValue(Promise.resolve(true));
      component.checkout();
      expect(router.navigate).toHaveBeenCalledWith(['/checkout']);
    });

    it('should handle navigation error', async () => {
      router.navigate.and.returnValue(Promise.reject('Navigation failed'));
      spyOn(console, 'error');

      component.checkout();
      await fixture.whenStable();

      expect(console.error).toHaveBeenCalledWith(
        'Navigation failed:',
        'Navigation failed'
      );
    });

    it('should handle error when router is not available', () => {
      router.navigate = undefined as any;
      spyOn(console, 'error');

      component.checkout();

      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('error handling in observables', () => {
    it('should handle error in cartItems$ observable', done => {
      store.overrideSelector('selectCartItems', undefined as any);

      component.cartItems$.subscribe(items => {
        expect(items).toEqual([]);
        done();
      });
    });

    it('should handle error in cartTotal$ observable', done => {
      store.overrideSelector('selectCartTotal', undefined as any);

      component.cartTotal$.subscribe(total => {
        expect(total).toBe(0);
        done();
      });
    });
  });

  describe('cleanup', () => {
    it('should complete and unsubscribe from destroy$ subject on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');
      spyOn(component['destroy$'], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
      expect(component['destroy$'].unsubscribe).toHaveBeenCalled();
    });
  });
});
