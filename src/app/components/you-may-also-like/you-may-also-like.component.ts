import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { Product } from '../../models/product.model';
import { selectProductsByCategory } from '../../store/product/product.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-you-may-also-like',
  standalone: true,
  imports: [ProductCardComponent, NgIf, NgFor, AsyncPipe, CommonModule],
  template: `
    <ng-container *ngIf="relatedProducts$ | async as products">
      <div *ngIf="products.length > 0">
        <h3 class="text-xl font-bold mt-8 mb-4">You may also like</h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <app-product-card
            *ngFor="let product of products; trackBy: trackByProductId"
            [product]="product"
          />
        </div>
      </div>
    </ng-container>
  `
})
export class YouMayAlsoLikeComponent implements OnInit, OnDestroy {
  @Input() category: string | null = null;
  @Input() excludeId: number | undefined;
  private readonly store = inject(Store);
  private readonly destroy$ = new Subject<void>();
  relatedProducts$: Observable<Product[]> = of([]);

  ngOnInit(): void {
    if (this.category) {
      this.relatedProducts$ = this.store.select(
        selectProductsByCategory(this.category, this.excludeId)
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByProductId(_index: number, product: Product): number {
    return product.id;
  }
}
