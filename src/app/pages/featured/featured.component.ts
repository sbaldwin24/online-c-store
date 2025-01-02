import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { setProductPagination } from '../../store/product/product.actions';
import {
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    // ... existing product grid template ...

    <mat-paginator
      class="mt-8"
      [length]="totalProducts$ | async"
      [pageSize]="12"
      [pageSizeOptions]="[12, 24, 36]"
      [showFirstLastButtons]="true"
      (page)="onPageChange($event)"
      aria-label="Select page of featured products"
    >
    </mat-paginator>
  `
})
export class FeaturedComponent {
  private store = inject(Store);

  products$ = this.store.select(selectPaginatedProducts);
  totalProducts$ = this.store.select(selectTotalProducts);

  onPageChange(event: PageEvent) {
    this.store.dispatch(
      setProductPagination({
        page: event.pageIndex,
        pageSize: event.pageSize
      })
    );
  }
}
