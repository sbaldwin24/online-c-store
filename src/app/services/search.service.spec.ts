import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Product } from '../models/product.model';
import { setQuery } from '../store/search/search.actions';
import {
  selectSearchLoading,
  selectSearchResults
} from '../store/search/search.selectors';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let store: MockStore;

  const mockProducts: Product[] = [
    {
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
    }
  ];

  const initialState = {
    search: {
      query: '',
      results: [],
      loading: false,
      error: null
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectSearchResults, value: [] },
            { selector: selectSearchLoading, value: false }
          ]
        })
      ]
    });

    service = TestBed.inject(SearchService);
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch setQuery action when searching', () => {
    const query = 'test';
    service.getSearchResults(query);

    expect(store.dispatch).toHaveBeenCalledWith(setQuery({ query }));
  });

  it('should return search results from store', done => {
    store.overrideSelector(selectSearchResults, mockProducts);
    store.refreshState();

    service.getSearchResults('test').subscribe(results => {
      expect(results).toEqual(mockProducts);
      done();
    });
  });

  it('should emit true when loading state is true', done => {
    store.overrideSelector(selectSearchLoading, true);
    store.refreshState();

    service.getSearchLoading().subscribe(loading => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should emit false when loading state is false', done => {
    store.overrideSelector(selectSearchLoading, false);
    store.refreshState();

    service.getSearchLoading().subscribe(loading => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should handle empty search results', done => {
    store.overrideSelector(selectSearchResults, []);
    store.refreshState();

    service.getSearchResults('nonexistent').subscribe(results => {
      expect(results).toEqual([]);
      done();
    });
  });

  it('should maintain search query while loading', () => {
    const query = 'test query';
    store.overrideSelector(selectSearchLoading, true);
    store.refreshState();

    service.getSearchResults(query);

    expect(store.dispatch).toHaveBeenCalledWith(setQuery({ query }));
  });
});
