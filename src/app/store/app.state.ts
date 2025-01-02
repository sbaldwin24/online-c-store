import { cartReducer, CartState } from './cart/cart.reducer';
import { ProductReducer, ProductState } from './product/product.reducer';
import { searchReducer, SearchState } from './search/search.reducer';

export interface AppState {
  product: ProductState;
  search: SearchState;
  cart: CartState;
}

export const reducers = {
  product: ProductReducer,
  cart: cartReducer,
  search: searchReducer
};
