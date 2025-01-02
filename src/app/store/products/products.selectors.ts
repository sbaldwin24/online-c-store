import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Product } from '../../models/product.model';

export const selectProductsState = createFeatureSelector<Product[]>('products');

export const selectFeaturedProducts = createSelector(
  selectProductsState,
  (products: Product[]): Product[] =>
    products.filter((product: Product) => product.rating >= 2.0).slice(0, 1)
);
