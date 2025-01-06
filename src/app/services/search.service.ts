import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { selectSearchLoading } from '../store/search/search.selectors';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly store = inject(Store);

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

  getSearchLoading(): Observable<boolean> {
    return this.store.select(selectSearchLoading);
  }
}
