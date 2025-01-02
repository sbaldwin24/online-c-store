import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { setQuery } from '../store/search/search.actions';
import {
  selectSearchLoading,
  selectSearchResults
} from '../store/search/search.selectors';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly store = inject(Store);

  getSearchResults(query: string): Observable<Product[]> {
    this.store.dispatch(setQuery({ query }));
    return this.store.select(selectSearchResults);
  }

  getSearchLoading(): Observable<boolean> {
    return this.store.select(selectSearchLoading);
  }
}
