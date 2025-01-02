import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCategories(): Observable<string[]> {
    return this.http
      .get<{ products: Product[] }>(`${this.apiUrl}/products`)
      .pipe(
        map(response => {
          const categories = new Set<string>();
          response.products.forEach(product => {
            if (product.category) {
              categories.add(product.category);
            }
          });
          return Array.from(categories);
        })
      );
  }

  getProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProductsByCategory(category: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(
      `${this.apiUrl}/products/category/${category}`
    );
  }

  searchProducts(query: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(
      `${this.apiUrl}/products/search?q=${query}`
    );
  }
}
