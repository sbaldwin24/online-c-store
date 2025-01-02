import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/product.model';
import { selectProductsState } from '../../store/products/products.selectors';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="container mx-auto px-4">
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">All Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (product of products$ | async; track product.id) {
          <app-product-card [product]="product" />
          }
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent {
  private readonly store = inject(Store);
  products$: Observable<Product[]> = this.store.select(selectProductsState);
}
