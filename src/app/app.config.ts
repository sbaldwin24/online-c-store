import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  isDevMode
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading
} from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { CartService } from './services/cart.services';
import { reducers } from './store/app.state';
import { CartEffects } from './store/cart/cart.effects';
import { ProductEffects } from './store/product/product.effects';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function initializeCart(cartService: CartService) {
  return () => {
    cartService.loadCart();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideStore(reducers),
    provideEffects([ProductEffects, CartEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75
    }),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCart,
      deps: [CartService],
      multi: true
    }, provideAnimationsAsync()
  ]
};
