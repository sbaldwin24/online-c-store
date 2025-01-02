import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.services';
import * as SearchActions from '../search/search.actions';
import * as ProductActions from './product.actions';

@Injectable()
export class ProductEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadCategories),
      switchMap(() =>
        this.productService.getCategories().pipe(
          map(categories =>
            ProductActions.loadCategoriesSuccess({ categories })
          ),
          catchError(error =>
            of(ProductActions.loadCategoriesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          map(response =>
            ProductActions.loadProductsSuccess({ products: response.products })
          ),
          catchError(error =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap(({ id }) =>
        this.productService.getProduct(id).pipe(
          map(product => ProductActions.loadProductSuccess({ product })),
          catchError(error =>
            of(ProductActions.loadProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadProductsByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductsByCategory),
      switchMap(({ category }) =>
        this.productService.getProductsByCategory(category).pipe(
          map(response =>
            ProductActions.loadProductsByCategorySuccess({
              products: response.products
            })
          ),
          catchError(error =>
            of(
              ProductActions.loadProductsByCategoryFailure({
                error: error.message
              })
            )
          )
        )
      )
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SearchActions.setQuery),
      switchMap(({ query }) =>
        this.productService.searchProducts(query).pipe(
          map(response =>
            ProductActions.loadProductsSuccess({
              products: response.products
            })
          )
        )
      )
    )
  );

  loadProductsByQuery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductsByQuery),
      switchMap(({ query }) =>
        this.productService.searchProducts(query).pipe(
          map(response =>
            ProductActions.loadProductsSuccess({
              products: response.products
            })
          )
        )
      )
    )
  );
}
