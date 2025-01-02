import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-search-result-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div
      class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <a [routerLink]="['/product', result.id]" class="block">
        <img
          [src]="result.thumbnail"
          [alt]="result.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {{ result.title }}
          </h3>
          <p class="text-gray-600 text-sm mb-2 line-clamp-2">
            {{ result.description }}
          </p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold text-blue-600">
              {{ result.price | currency }}
            </span>
            <div class="flex items-center">
              <span class="text-yellow-400 mr-1">★</span>
              <span class="text-sm text-gray-600">{{ result.rating }}</span>
            </div>
          </div>
        </div>
      </a>
    </div>
  `
})
export class SearchResultCardComponent {
  @Input({ required: true }) result!: Product;
}
