import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { ProductState } from './product.reducer';

export const selectProductState = (state: AppState) => state.product;

export const selectCategories = createSelector(
  selectProductState,
  (state: ProductState) => state.categories
);

export const selectProducts = createSelector(
  selectProductState,
  (state: ProductState) => {
    const { sortBy, sortOrder } = state.pagination;
    const sortedProducts = [...state.products];

    switch (sortBy) {
      case 'price':
        sortedProducts.sort((a, b) =>
          sortOrder === 'asc' ? a.price - b.price : b.price - a.price
        );
        break;
      case 'rating':
        sortedProducts.sort((a, b) =>
          sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
        );
        break;
      case 'title':
        sortedProducts.sort((a, b) => {
          const comparison = a.title.localeCompare(b.title);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'featured':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
    }

    return sortedProducts;
  }
);

export const selectFilteredProducts = (query: string) =>
  createSelector(selectProducts, products => {
    const searchTerm = query.toLowerCase();
    return products.filter(
      product =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  });

export const selectPaginatedProducts = createSelector(
  selectProducts,
  selectProductState,
  (products, state) => {
    const { page, pageSize } = state.pagination;
    const start = page * pageSize;
    const end = start + pageSize;
    return products.slice(start, end);
  }
);

export const selectTotalProducts = createSelector(
  selectProducts,
  products => products.length
);

export const selectSelectedProduct = createSelector(
  selectProductState,
  (state: ProductState) => state.selectedProduct
);

export const selectLoading = createSelector(
  selectProductState,
  (state: ProductState) => state.loading
);

export const selectError = createSelector(
  selectProductState,
  (state: ProductState) => state.error
);

export const selectProductById = (productId: number) =>
  createSelector(selectProducts, products =>
    products.find(product => product.id === productId)
  );

export const selectProductsByCategory = (
  categoryId: string,
  excludeId?: number
) =>
  createSelector(selectProducts, products =>
    products.filter(
      product =>
        product.category === categoryId &&
        (!excludeId || product.id !== excludeId)
    )
  );
