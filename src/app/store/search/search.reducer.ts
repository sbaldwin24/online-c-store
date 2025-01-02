// src/app/store/search/search.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { setCategoryFilter, setQuery } from './search.actions';

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchState {
  query: string;
  results: Product[];
  allProducts: Product[];
  loading: boolean;
  error: string | null;
  selectedCategories: string[];
  priceRange: PriceRange;
  selectedRating: number | null;
}

export const initialState: SearchState = {
  query: '',
  results: [],
  allProducts: [],
  loading: false,
  error: null,
  selectedCategories: [],
  priceRange: { min: 0, max: 1000 },
  selectedRating: null
};

export const searchReducer = createReducer(
  initialState,
  on(setQuery, (state, { query }) => ({
    ...state,
    query,
    loading: true
  })),
  on(setCategoryFilter, (state, { category }) => ({
    ...state,
    selectedCategories: [...state.selectedCategories, category],
    loading: true
  }))
);
