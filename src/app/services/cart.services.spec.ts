import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AddItem, LoadCart } from '../store/cart/cart.actions';
import { CartService } from './cart.services';

describe('CartService', () => {
  let service: CartService;
  let store: MockStore;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    thumbnail: 'test-image.jpg',
    images: ['image1.jpg'],
    category: 'electronics',
    rating: 4.5,
    stock: 10,
    brand: 'Test Brand',
    discountPercentage: 10
  };

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      quantity: 2
    }
  ];

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', [
      'getItem',
      'setItem'
    ]);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    TestBed.configureTestingModule({
      providers: [
        CartService,
        provideMockStore({
          initialState: {
            cart: {
              items: [],
              totalQuantity: 0,
              subtotal: 0,
              discount: 0,
              total: 0
            }
          }
        })
      ]
    });

    service = TestBed.inject(CartService);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add item to cart', () => {
    service.addToCart(mockProduct);

    expect(store.dispatch).toHaveBeenCalledWith(
      AddItem({ product: mockProduct })
    );
  });

  it('should load cart from localStorage', () => {
    localStorageSpy.getItem.and.returnValue(JSON.stringify(mockCartItems));

    service.loadCart();

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('shopping_cart');
    expect(store.dispatch).toHaveBeenCalledWith(
      LoadCart({ items: mockCartItems })
    );
  });

  it('should not dispatch LoadCart when localStorage is empty', () => {
    localStorageSpy.getItem.and.returnValue(null);

    service.loadCart();

    expect(localStorageSpy.getItem).toHaveBeenCalledWith('shopping_cart');
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should save cart to localStorage', () => {
    service.saveCart(mockCartItems);

    expect(localStorageSpy.setItem).toHaveBeenCalledWith(
      'shopping_cart',
      JSON.stringify(mockCartItems)
    );
  });

  it('should handle empty cart items when saving', () => {
    service.saveCart([]);

    expect(localStorageSpy.setItem).toHaveBeenCalledWith('shopping_cart', '[]');
  });
});
