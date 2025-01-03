import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getSearchResults(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/search?q=${query}`
    );
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/category/${category}`
    );
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}
