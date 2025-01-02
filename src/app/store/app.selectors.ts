import { createFeatureSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { ProductState } from './product/product.reducer';

export const selectProductState = createFeatureSelector<AppState, ProductState>(
  'products'
);
