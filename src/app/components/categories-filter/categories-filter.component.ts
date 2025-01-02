import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCategories } from '../../store/product/product.selectors';

@Component({
  selector: 'app-categories-filter',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4">
        <div
          class="flex items-center space-x-4 overflow-x-auto py-4 scrollbar-hide"
        >
          <a
            routerLink="/"
            routerLinkActive="text-blue-600 font-semibold"
            [routerLinkActiveOptions]="{ exact: true }"
            class="text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            All Products
          </a>
          @for (category of categories$ | async; track category) {
            <a
              [routerLink]="['/category', category]"
              routerLinkActive="text-blue-600 font-semibold"
              class="text-gray-600 hover:text-blue-600 transition-colors capitalize whitespace-nowrap"
            >
              {{ category }}
            </a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ]
})
export class CategoriesFilterComponent {
  private readonly store = inject(Store);
  protected readonly categories$ = this.store.select(selectCategories);
}
