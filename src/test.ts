import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js';
import 'zone.js/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true
  }
);

// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideMockStore } from '@ngrx/store/testing';
import 'zone.js';
import 'zone.js/testing';
import { CartEffects } from './app/store/cart/cart.effects';
import { ProductEffects } from './app/store/product/product.effects';

// Setup default test module configuration
const defaultTestModuleConfig = {
  imports: [BrowserAnimationsModule, HttpClientTestingModule],
  providers: [provideMockStore(), provideEffects([CartEffects, ProductEffects])]
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
