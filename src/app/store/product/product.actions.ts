// src/app/store/product/product.actions.ts
import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product.model';

export const loadCategories = createAction('[Product] Load Categories');
export const loadCategoriesSuccess = createAction(
  '[Product] Load Categories Success',
  props<{ categories: string[] }>()
);
export const loadCategoriesFailure = createAction(
  '[Product] Load Categories Failure',
  props<{ error: string }>()
);

export const setProductPagination = createAction(
  '[Product] Set Pagination',
  props<{
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>()
);

export const loadProducts = createAction('[Product] Load Products');
export const loadProductsSuccess = createAction(
  '[Product] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load Products Failure',
  props<{ error: string }>()
);

export const loadProduct = createAction(
  '[Product] Load Product',
  props<{ id: number }>()
);
export const loadProductSuccess = createAction(
  '[Product] Load Product Success',
  props<{ product: Product }>()
);
export const loadProductFailure = createAction(
  '[Product] Load Product Failure',
  props<{ error: string }>()
);

export const loadProductsByCategory = createAction(
  '[Product] Load Products By Category',
  props<{ category: string }>()
);
export const loadProductsByCategorySuccess = createAction(
  '[Product] Load Products By Category Success',
  props<{ products: Product[] }>()
);
export const loadProductsByCategoryFailure = createAction(
  '[Product] Load Products By Category Failure',
  props<{ error: string }>()
);

export const loadProductsByQuery = createAction(
  '[Product] Load Products By Query',
  props<{ query: string }>()
);
