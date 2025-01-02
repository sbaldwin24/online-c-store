import { CartState } from '../store/cart/cart.reducer';
import { ProductState } from '../store/product/product.reducer';
import { SearchState } from '../store/search/search.reducer';

export interface AppState {
  products: ProductState;
  cart: CartState;
  search: SearchState;
}
