import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, tap } from 'rxjs';
import { ProductListComponent } from '../../components/product-list';
import { loadProducts } from '../../store/product/product.actions';
import {
  selectError,
  selectLoading,
  selectProducts
} from '../../store/product/product.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  template: `
    <main class="container mx-auto px-4 py-8 max-w-7xl">
      <section class="mb-12">
        <h1 class="text-3xl font-bold mb-8 text-gray-900">Our Products</h1>
        <app-product-list
          [products]="products$ | async"
          [isLoading]="(isLoading$ | async) ?? false"
          class="block"
        >
        </app-product-list>
      </section>
    </main>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private errorSubscription?: Subscription;

  protected readonly products$ = this.store
    .select(selectProducts)
    .pipe(tap(() => {}));
  protected readonly isLoading$ = this.store
    .select(selectLoading)
    .pipe(tap(() => {}));
  protected readonly error$ = this.store
    .select(selectError)
    .pipe(tap(error => error && console.error('Error state:', error)));

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
    this.errorSubscription = this.error$.subscribe();
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
