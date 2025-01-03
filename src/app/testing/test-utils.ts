import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { CartService } from '../services/cart.services';
import { CartEffects } from '../store/cart/cart.effects';
import { ProductEffects } from '../store/product/product.effects';

export function mockInitializeCart() {
  return () => {
    // Mock initialization
  };
}

export const getBaseTestProviders = () => [
  {
    provide: HttpClient,
    useValue: {
      get: jasmine.createSpy('get'),
      post: jasmine.createSpy('post'),
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete')
    }
  },
  {
    provide: APP_INITIALIZER,
    useFactory: mockInitializeCart,
    deps: [CartService],
    multi: true
  }
];

export const getBaseTestImports = () => [BrowserAnimationsModule];

export const getBaseTestEffects = () => [
  provideEffects([ProductEffects, CartEffects])
];

export function setupMockStore() {
  const store = TestBed.inject(Store);
  return store;
}

export const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  thumbnail: 'test-image.jpg',
  images: ['image1.jpg', 'image2.jpg'],
  category: 'electronics',
  rating: 4.5,
  stock: 10,
  brand: 'Test Brand',
  discountPercentage: 0.1
};
