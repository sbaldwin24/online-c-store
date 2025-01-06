import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import 'zone.js';
import 'zone.js/testing';
import { CartEffects } from './app/store/cart/cart.effects';
import { ProductEffects } from './app/store/product/product.effects';

// Prevent TestBed from being used before initialization
try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      errorOnUnknownElements: true,
      errorOnUnknownProperties: true,
      teardown: { destroyAfterEach: true }
    }
  );
} catch (e) {
  console.error('Error initializing test environment:', e);
  if (
    e instanceof Error &&
    e.message.includes('DynamicTestModule has already been loaded')
  ) {
    console.warn('Test environment was already initialized');
  } else {
    throw e;
  }
}

// Setup default test module configuration
const defaultTestModuleConfig = {
  imports: [BrowserAnimationsModule],
  providers: [
    provideMockStore(),
    provideEffects([CartEffects, ProductEffects]),
    provideHttpClient()
  ]
};

// Export helper function to configure test modules
export function configureTestModule(config: any = {}) {
  const finalConfig = {
    ...defaultTestModuleConfig,
    ...config,
    imports: [...defaultTestModuleConfig.imports, ...(config.imports || [])],
    providers: [
      ...defaultTestModuleConfig.providers,
      ...(config.providers || [])
    ]
  };

  return TestBed.configureTestingModule(finalConfig);
}
