import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.services';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  template: `
    <div
      class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <a [routerLink]="['/product', product.id]" class="block">
        <div class="aspect-w-1 aspect-h-1">
          <img
            [ngSrc]="product.thumbnail"
            [alt]="product.title"
            [width]="400"
            [height]="400"
            priority="false"
            loading="lazy"
            class="object-cover w-full h-full"
            fetchpriority="low"
          />
        </div>
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900 truncate">
            {{ product.title }}
          </h3>
          <p class="mt-1 text-gray-500 text-sm line-clamp-2">
            {{ product.description }}
          </p>
          <div class="mt-4 flex items-center justify-between">
            <span class="text-lg font-bold text-gray-900"
              >\${{ product.price }}</span
            >
            <button
              type="button"
              (click)="addToCart(); $event.preventDefault()"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </a>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;
  private readonly cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.product);
  }
}
