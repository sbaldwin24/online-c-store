import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Product } from '../../models/product.model';
import { loadProducts } from '../../store/product/product.actions';
import { selectProducts } from '../../store/product/product.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-you-may-also-like',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <section class="mt-12">
      <h2 class="text-2xl font-bold mb-6">You May Also Like</h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        @for (product of relatedProducts$ | async; track product.id) {
          <app-product-card
            [product]="product"
            (click)="onProductSelect(product)"
          ></app-product-card>
        }
      </div>
    </section>
  `
})
export class YouMayAlsoLikeComponent implements OnInit {
  @Input() category: string | null = null;
  @Input() excludeId?: number;

  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  protected readonly relatedProducts$ = this.store.select(selectProducts).pipe(
    map(products => {
      // Filter products by category if provided
      let filtered = this.category
        ? products.filter(p => p.category === this.category)
        : products;

      // Exclude the current product if excludeId is provided
      if (this.excludeId !== undefined) {
        filtered = filtered.filter(p => p.id !== this.excludeId);
      }

      return this.getRandomProducts(filtered, 4);
    })
  );

  ngOnInit(): void {
    this.store.dispatch(loadProducts());
  }

  private getRandomProducts(products: Product[], count: number): Product[] {
    return [...products].sort(() => Math.random() - 0.5).slice(0, count);
  }

  protected onProductSelect(product: Product): void {
    this.router.navigate(['/product', product.id]).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    });
  }
}
