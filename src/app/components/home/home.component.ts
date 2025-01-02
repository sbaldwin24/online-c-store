import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import {
  loadCategories,
  loadProducts,
  loadProductsByCategory,
  setProductPagination
} from '../../store/product/product.actions';
import {
  selectLoading,
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';
import { CategoriesFilterComponent } from '../categories-filter/categories-filter.component';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    MatPaginatorModule,
    CategoriesFilterComponent
  ],
  template: `
    <app-categories-filter />

    <div class="container mx-auto px-4 py-8">
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">
          {{ category ? (category | titlecase) + ' Products' : 'All Products' }}
        </h2>

        @if (isLoading) {
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            @for (item of [1, 2, 3, 4, 5, 6, 7, 8]; track item) {
              <div class="animate-pulse">
                <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            }
          </div>
        } @else {
          <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            @for (product of products; track product.id) {
              <app-product-card [product]="product" />
            }
          </div>

          @if (products.length > 0) {
            <mat-paginator
              class="mt-8"
              [length]="totalProducts"
              [pageSize]="12"
              [pageSizeOptions]="[12, 24, 36]"
              [showFirstLastButtons]="true"
              (page)="onPageChange($event)"
              aria-label="Select page of products"
            >
            </mat-paginator>
          }
        }
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  protected products: Product[] = [];
  protected totalProducts = 0;
  protected category: string | null = null;
  protected isLoading = false;

  ngOnInit(): void {
    this.store.dispatch(loadCategories());

    this.store
      .select(selectLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.category = params['category'] || null;

      if (this.category) {
        this.store.dispatch(
          loadProductsByCategory({ category: this.category })
        );
      } else {
        this.store.dispatch(loadProducts());
      }
    });

    this.store
      .select(selectPaginatedProducts)
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.products = products;
      });

    this.store
      .select(selectTotalProducts)
      .pipe(takeUntil(this.destroy$))
      .subscribe(total => {
        this.totalProducts = total;
      });
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(
      setProductPagination({
        page: event.pageIndex,
        pageSize: event.pageSize
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
