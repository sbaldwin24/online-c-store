import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchResult } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: Signal<string>): Observable<SearchResult[]> {
    return this.http.get<SearchResult[]>(`/api/search?q=${query()}`);
  }
}
