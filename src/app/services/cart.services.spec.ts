import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { Product } from '../models/product.model';
import {
  AddItem,
  ClearCart,
  LoadCart,
  RemoveCartItem
} from '../store/cart/cart.actions';
import { CartState } from '../store/cart/cart.reducer';
import { CartItem, CartService } from './cart.services';

describe('CartService', () => {
  let service: CartService;
  let store: jasmine.SpyObj<Store>;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockProduct: Product = {
    id: 1,
    title: 'Product 1',
    price: 10.99,
    description: 'Description 1',
    category: 'Category 1',
    thumbnail: 'image1.jpg',
    images: ['image1.jpg'],
    rating: 4.5,
    stock: 100,
    brand: 'Brand 1',
    discountPercentage: 10
  };

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Product 1',
      price: 10.99,
      quantity: 1
    }
  ];

  const mockCartState: CartState = {
    items: {
      '1': {
        product: mockProduct,
        quantity: 1
      }
    },
    appliedPromoCode: null,
    discount: 0
  };

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.returnValue(of(mockCartItems));

    localStorageSpy = jasmine.createSpyObj('Storage', [
      'getItem',
      'setItem',
      'removeItem'
    ]);
    spyOn(localStorage, 'getItem').and.callFake(localStorageSpy.getItem);
    spyOn(localStorage, 'setItem').and.callFake(localStorageSpy.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(localStorageSpy.removeItem);

    TestBed.configureTestingModule({
      providers: [CartService, { provide: Store, useValue: storeSpy }]
    });

    service = TestBed.inject(CartService);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadCart', () => {
    it('should load cart from localStorage and dispatch LoadCart action', () => {
      localStorageSpy.getItem.and.returnValue(JSON.stringify(mockCartState));

      service.loadCart();

      expect(localStorageSpy.getItem).toHaveBeenCalledWith('shopping_cart');
      expect(store.dispatch).toHaveBeenCalledWith(
        LoadCart({
          items: [
            {
              id: 1,
              name: 'Product 1',
              price: 10.99,
              quantity: 1
            }
          ]
        })
      );
    });

    it('should handle empty localStorage', () => {
      localStorageSpy.getItem.and.returnValue(null);

      service.loadCart();

      expect(localStorageSpy.getItem).toHaveBeenCalledWith('shopping_cart');
      expect(store.dispatch).toHaveBeenCalledWith(LoadCart({ items: [] }));
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageSpy.getItem.and.returnValue('invalid json');

      service.loadCart();

      expect(localStorageSpy.getItem).toHaveBeenCalledWith('shopping_cart');
      expect(store.dispatch).toHaveBeenCalledWith(LoadCart({ items: [] }));
    });
  });

  describe('getCartItems', () => {
    it('should return cart items from store', done => {
      service.getCartItems().subscribe(items => {
        expect(items).toEqual(mockCartItems);
        done();
      });
    });
  });

  describe('addToCart', () => {
    it('should dispatch AddItem action', () => {
      service.addToCart(mockProduct);

      expect(store.dispatch).toHaveBeenCalledWith(
        AddItem({ product: mockProduct })
      );
    });
  });

  describe('removeFromCart', () => {
    it('should dispatch RemoveCartItem action', () => {
      service.removeFromCart(1);

      expect(store.dispatch).toHaveBeenCalledWith(RemoveCartItem({ id: 1 }));
    });
  });

  describe('updateQuantity', () => {
    it('should remove item when quantity is 0', () => {
      service.updateQuantity(1, 0);

      expect(store.dispatch).toHaveBeenCalledWith(RemoveCartItem({ id: 1 }));
    });

    it('should not dispatch any action when quantity is greater than 0', () => {
      service.updateQuantity(1, 2);

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('clearCart', () => {
    it('should dispatch ClearCart action and return a promise', async () => {
      await service.clearCart();

      expect(store.dispatch).toHaveBeenCalledWith(ClearCart());
    });
  });

  describe('saveCart', () => {
    it('should save cart items to localStorage', () => {
      service.saveCart(mockCartItems);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'shopping_cart',
        JSON.stringify(mockCartItems)
      );
    });
  });
});
