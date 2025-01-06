import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { Product } from '../../models/product.model';
import * as CartActions from './cart.actions';
import { CartEffects } from './cart.effects';
import { CartState } from './cart.reducer';
import { selectCartState } from './cart.selectors';

describe('CartEffects', () => {
  let actions$: Subject<Action>;
  let effects: CartEffects;
  let store: MockStore;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'Test Description',
    discountPercentage: 0,
    rating: 4.5,
    stock: 100,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test.jpg',
    images: ['test.jpg']
  };

  const initialState: CartState = {
    items: [],
    discount: 0,
    appliedPromoCode: null
  };

  beforeEach(() => {
    actions$ = new Subject<Action>();
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    localStorageSpy = jasmine.createSpyObj('localStorage', [
      'setItem',
      'getItem',
      'removeItem'
    ]);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    TestBed.configureTestingModule({
      providers: [
        CartEffects,
        provideMockActions(() => actions$.asObservable()),
        provideMockStore({
          initialState,
          selectors: [{ selector: selectCartState, value: initialState }]
        }),
        { provide: MatSnackBar, useValue: snackBar }
      ]
    });

    effects = TestBed.inject(CartEffects);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('saveCart$', () => {
    it('should save cart state to localStorage when cart actions are dispatched', done => {
      const actions = [
        CartActions.AddItem({ product: mockProduct }),
        CartActions.RemoveCartItem({ id: 1 }),
        CartActions.IncrementItemQuantity({ id: 2 }),
        CartActions.DecrementItemQuantity({ id: 2 }),
        CartActions.ClearCart(),
        CartActions.ApplyPromoCode({ code: 'TESTCODE' }),
        CartActions.RemovePromoCode(),
        CartActions.UpdateDiscount({ discount: 10 })
      ];

      let count = 0;
      effects.saveCart$.subscribe(() => {
        expect(localStorageSpy.setItem).toHaveBeenCalledWith(
          'shopping_cart',
          jasmine.any(String)
        );
        count++;
        if (count === actions.length) {
          done();
        }
      });

      actions.forEach(action => {
        actions$.next(action);
      });
    });

    it('should handle localStorage errors gracefully', done => {
      const error = new Error('Storage full');
      localStorageSpy.setItem.and.throwError(error);

      effects.saveCart$.subscribe({
        error: err => {
          expect(err).toBeTruthy();
          expect(err.message).toBe('Storage full');
          done();
        }
      });

      actions$.next(CartActions.AddItem({ product: mockProduct }));
    });
  });

  describe('showAddToCartNotification$', () => {
    it('should display a snackbar notification when AddItem action is dispatched', done => {
      effects.showAddToCartNotification$.subscribe(() => {
        expect(snackBar.open).toHaveBeenCalledWith(
          `${mockProduct.title} added to cart`,
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: [
              'success-snackbar',
              'above-footer',
              'snackbar-centered'
            ]
          }
        );
        done();
      });

      actions$.next(CartActions.AddItem({ product: mockProduct }));
    });

    it('should handle null product gracefully', done => {
      effects.showAddToCartNotification$.subscribe({
        error: err => {
          expect(err).toBeTruthy();
          expect(err.message).toBe('Invalid product');
          done();
        }
      });

      actions$.next(CartActions.AddItem({ product: null as any }));
    });

    it('should handle product without title gracefully', done => {
      const invalidProduct: Product = {
        ...mockProduct,
        title: ''
      };

      effects.showAddToCartNotification$.subscribe({
        error: err => {
          expect(err).toBeTruthy();
          expect(err.message).toBe('Invalid product title');
          done();
        }
      });

      actions$.next(CartActions.AddItem({ product: invalidProduct }));
    });
  });
});
