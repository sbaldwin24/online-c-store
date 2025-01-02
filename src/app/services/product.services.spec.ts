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

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      description: 'Description 1',
      price: 99.99,
      thumbnail: 'image1.jpg',
      images: ['image1.jpg'],
      category: 'electronics',
      rating: 4.5,
      stock: 10,
      brand: 'Brand 1',
      discountPercentage: 10
    },
    {
      id: 2,
      title: 'Product 2',
      description: 'Description 2',
      price: 149.99,
      thumbnail: 'image2.jpg',
      images: ['image2.jpg'],
      category: 'clothing',
      rating: 4.0,
      stock: 5,
      brand: 'Brand 2',
      discountPercentage: 15
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

  it('should get categories', () => {
    const expectedCategories = ['electronics', 'clothing'];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(expectedCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts });
  });

  it('should get all products', () => {
    service.getProducts().subscribe(response => {
      expect(response.products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts });
  });

  it('should get a single product by id', () => {
    const mockProduct = mockProducts[0];

    service.getProduct(1).subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should get products by category', () => {
    const category = 'electronics';
    const expectedProducts = mockProducts.filter(p => p.category === category);

    service.getProductsByCategory(category).subscribe(response => {
      expect(response.products).toEqual(expectedProducts);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/category/${category}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ products: expectedProducts });
  });

  it('should search products', () => {
    const query = 'product';
    const expectedProducts = mockProducts.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );

    service.searchProducts(query).subscribe(response => {
      expect(response.products).toEqual(expectedProducts);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/products/search?q=${query}`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ products: expectedProducts });
  });

  it('should handle empty response when getting categories', () => {
    service.getCategories().subscribe(categories => {
      expect(categories).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: [] });
  });

  it('should handle error responses', () => {
    const errorMessage = 'Server error';

    service.getProducts().subscribe({
      error: error => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    req.flush('Server error', { status: 500, statusText: errorMessage });
  });

  it('should handle null category in products when getting categories', () => {
    const productsWithNullCategory = [
      { ...mockProducts[0], category: null },
      ...mockProducts.slice(1)
    ];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(['clothing']);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: productsWithNullCategory });
  });
});
