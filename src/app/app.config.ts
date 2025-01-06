import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { CartEffects } from './store/cart/cart.effects';
import { cartReducer } from './store/cart/cart.reducer';
import { ProductEffects } from './store/product/product.effects';
import { ProductReducer } from './store/product/product.reducer';
import { searchReducer } from './store/search/search.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        onSameUrlNavigation: 'reload'
      })
    ),
    provideStore({
      product: ProductReducer,
      cart: cartReducer,
      search: searchReducer
    }),
    provideEffects([ProductEffects, CartEffects]),
    provideAnimations(),
    provideHttpClient()
  ]
};
