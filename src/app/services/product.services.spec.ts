import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { ProductService } from './product.services';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
      description: 'Test Description 1',
      price: 100,
      discountPercentage: 10,
      rating: 4.5,
      stock: 50,
      brand: 'Test Brand 1',
      category: 'Category 1',
      thumbnail: 'test-thumbnail-1.jpg',
      images: ['image1.jpg', 'image2.jpg']
    },
    {
      id: 2,
      title: 'Test Product 2',
      description: 'Test Description 2',
      price: 200,
      discountPercentage: 20,
      rating: 4.0,
      stock: 30,
      brand: 'Test Brand 2',
      category: 'Category 2',
      thumbnail: 'test-thumbnail-2.jpg',
      images: ['image3.jpg', 'image4.jpg']
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCategories', () => {
    it('should return unique categories from products', () => {
      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(['Category 1', 'Category 2']);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: mockProducts });
    });

    it('should handle empty products array', () => {
      service.getCategories().subscribe(categories => {
        expect(categories).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: [] });
    });

    it('should handle products with missing categories', () => {
      const productsWithMissingCategories = [
        { ...mockProducts[0], category: undefined },
        { ...mockProducts[1] }
      ];

      service.getCategories().subscribe(categories => {
        expect(categories).toEqual(['Category 2']);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: productsWithMissingCategories });
    });

    it('should handle HTTP error', () => {
      service.getCategories().subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('getProducts', () => {
    it('should return all products', () => {
      service.getProducts().subscribe(response => {
        expect(response.products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: mockProducts });
    });

    it('should handle empty products array', () => {
      service.getProducts().subscribe(response => {
        expect(response.products).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: [] });
    });

    it('should handle HTTP error', () => {
      service.getProducts().subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products`);
      expect(req.request.method).toBe('GET');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('getProduct', () => {
    it('should return a single product by ID', () => {
      const productId = 1;
      service.getProduct(productId).subscribe(product => {
        expect(product).toEqual(mockProducts[0]);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts[0]);
    });

    it('should handle non-existent product ID', () => {
      const productId = 999;
      service.getProduct(productId).subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Product not found', {
        status: 404,
        statusText: 'Not Found'
      });
    });

    it('should handle HTTP error', () => {
      const productId = 1;
      service.getProduct(productId).subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category', () => {
      const category = 'Category 1';
      const expectedProducts = [mockProducts[0]];

      service.getProductsByCategory(category).subscribe(response => {
        expect(response.products).toEqual(expectedProducts);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: expectedProducts });
    });

    it('should handle empty category results', () => {
      const category = 'Non-existent Category';

      service.getProductsByCategory(category).subscribe(response => {
        expect(response.products).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: [] });
    });

    it('should handle HTTP error', () => {
      const category = 'Category 1';

      service.getProductsByCategory(category).subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });

  describe('searchProducts', () => {
    it('should return products matching search query', () => {
      const query = 'Test';
      const expectedProducts = mockProducts;

      service.searchProducts(query).subscribe(response => {
        expect(response.products).toEqual(expectedProducts);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: expectedProducts });
    });

    it('should handle empty search results', () => {
      const query = 'Non-existent Product';

      service.searchProducts(query).subscribe(response => {
        expect(response.products).toEqual([]);
      });

      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush({ products: [] });
    });

    it('should handle HTTP error', () => {
      const query = 'Test';

      service.searchProducts(query).subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/products/search?q=${query}`);
      expect(req.request.method).toBe('GET');
      req.flush('Internal Server Error', {
        status: 500,
        statusText: 'Internal Server Error'
      });
    });
  });
});
