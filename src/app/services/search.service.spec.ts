import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { firstValueFrom, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { selectSearchLoading } from '../store/search/search.selectors';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let store: jasmine.SpyObj<Store>;
  const apiUrl = environment.apiUrl;

  const mockProducts: Product[] = [
    {
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
    },
    {
      id: 2,
      title: 'Product 2',
      price: 20.99,
      description: 'Description 2',
      category: 'Category 2',
      thumbnail: 'image2.jpg',
      images: ['image2.jpg'],
      rating: 4.0,
      stock: 50,
      brand: 'Brand 2',
      discountPercentage: 5
    }
  ];

  const mockCategories = ['Category 1', 'Category 2'];

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('Store', ['select']);
    storeSpy.select.and.callFake((selector: unknown) => {
      if (selector === selectSearchLoading) return of(false);
      return of(undefined);
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SearchService, { provide: Store, useValue: storeSpy }]
    });

    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSearchResults', () => {
    it('should return search results for a query', async () => {
      const query = 'Product 1';
      const expectedProducts = [mockProducts[0]];

      const promise = firstValueFrom(service.getSearchResults(query));
      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProducts);

      const products = await promise;
      expect(products).toEqual(expectedProducts);
    });

    it('should handle empty search results', async () => {
      const query = 'NonExistentProduct';

      const promise = firstValueFrom(service.getSearchResults(query));
      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      const products = await promise;
      expect(products).toEqual([]);
    });

    it('should handle empty query', async () => {
      const query = '';

      const promise = firstValueFrom(service.getSearchResults(query));
      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      const products = await promise;
      expect(products).toEqual(mockProducts);
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const promise = firstValueFrom(service.getAllCategories());
      const req = httpMock.expectOne(`${apiUrl}/products/categories`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCategories);

      const categories = await promise;
      expect(categories).toEqual(mockCategories);
    });

    it('should handle empty categories', async () => {
      const promise = firstValueFrom(service.getAllCategories());
      const req = httpMock.expectOne(`${apiUrl}/products/categories`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      const categories = await promise;
      expect(categories).toEqual([]);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for a category', async () => {
      const category = 'Category 1';
      const expectedProducts = [mockProducts[0]];

      const promise = firstValueFrom(service.getProductsByCategory(category));
      const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(expectedProducts);

      const products = await promise;
      expect(products).toEqual(expectedProducts);
    });

    it('should handle empty category results', async () => {
      const category = 'NonExistentCategory';

      const promise = firstValueFrom(service.getProductsByCategory(category));
      const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      const products = await promise;
      expect(products).toEqual([]);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const promise = firstValueFrom(service.getAllProducts());
      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      const products = await promise;
      expect(products).toEqual(mockProducts);
    });

    it('should handle empty products list', async () => {
      const promise = firstValueFrom(service.getAllProducts());
      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush([]);

      const products = await promise;
      expect(products).toEqual([]);
    });
  });

  describe('getSearchLoading', () => {
    it('should return search loading state from store', async () => {
      const loading = await firstValueFrom(service.getSearchLoading());
      expect(loading).toBe(false);
      expect(store.select).toHaveBeenCalled();
      expect(store.select).toHaveBeenCalledTimes(1);
      const [selector] = store.select.calls.mostRecent().args;
      expect(selector).toBe(selectSearchLoading);
    });
  });
});
