import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import * as SearchActions from '../search/search.actions';
import * as ProductActions from './product.actions';

export interface ProductState {
  products: Product[];
  categories: string[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

export const initialState: ProductState = {
  products: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    pageSize: 12,
    sortBy: 'featured',
    sortOrder: 'desc'
  }
};

export const ProductReducer = createReducer(
  initialState,
  on(ProductActions.loadCategories, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false
  })),
  on(ProductActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(
    ProductActions.setProductPagination,
    (state, { page, pageSize, sortBy, sortOrder }) => ({
      ...state,
      pagination: {
        ...state.pagination,
        ...(page !== undefined && { page }),
        ...(pageSize !== undefined && { pageSize }),
        ...(sortBy !== undefined && { sortBy }),
        ...(sortOrder !== undefined && { sortOrder })
      }
    })
  ),
  on(ProductActions.loadProducts, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductActions.loadProduct, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false
  })),
  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(ProductActions.loadProductsByCategory, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsByCategorySuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false
  })),
  on(ProductActions.loadProductsByCategoryFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(SearchActions.setQuery, (state, {}) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(ProductActions.loadProductsByQuery, state => ({
    ...state,
    loading: true,
    error: null
  }))
);
