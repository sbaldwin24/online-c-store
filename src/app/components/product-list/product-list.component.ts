import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product.model';
import {
  loadProducts,
  setProductPagination
} from '../../store/product/product.actions';
import {
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, MatPaginatorModule],
  template: `
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <app-product-card
        *ngFor="let product of products$ | async"
        [product]="product"
      />
    </div>

    <div class="flex justify-center mt-8">
      <mat-paginator
        class="custom-paginator bg-white rounded-lg shadow-sm border border-gray-100"
        [length]="totalProducts$ | async"
        [pageSize]="12"
        [pageSizeOptions]="[12, 24, 36]"
        [showFirstLastButtons]="true"
        (page)="onPageChange($event)"
        aria-label="Select page of products"
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      ::ng-deep .custom-paginator {
        @apply font-medium;

        .mat-mdc-paginator-container {
          @apply min-h-[56px] px-4;
        }

        .mat-mdc-paginator-range-label {
          @apply text-gray-600 mx-4;
        }

        .mat-mdc-paginator-navigation-previous,
        .mat-mdc-paginator-navigation-next,
        .mat-mdc-paginator-navigation-first,
        .mat-mdc-paginator-navigation-last {
          @apply text-gray-600 hover:bg-gray-100 rounded-full;
        }

        .mat-mdc-paginator-page-size-label {
          @apply text-gray-600 mr-4;
        }

        .mdc-text-field--outlined {
          @apply rounded-lg overflow-hidden;
        }

        .mat-mdc-select-value {
          @apply text-gray-600;
        }

        .mat-mdc-paginator-icon {
          @apply fill-current;
        }
      }
    `
  ]
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[] | null = null;
  @Input() isLoading = false;

  private store = inject(Store);
  products$ = this.store.select(selectPaginatedProducts);
  totalProducts$ = this.store.select(selectTotalProducts);

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      setProductPagination({
        page: event.pageIndex,
        pageSize: event.pageSize
      })
    );
  }
}
