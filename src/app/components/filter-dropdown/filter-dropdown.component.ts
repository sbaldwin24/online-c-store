import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { setProductPagination } from '../../store/product/product.actions';

type SortOrder = 'asc' | 'desc';

interface SortConfig {
  sortBy: string;
  sortOrder: SortOrder;
}

const SORT_OPTIONS = {
  FEATURED: 'Featured',
  PRICE_LOW_HIGH: 'Price: Low to High',
  PRICE_HIGH_LOW: 'Price: High to Low',
  RATING_HIGH_LOW: 'Rating: High to Low',
  NAME_A_Z: 'Name: A to Z',
  NAME_Z_A: 'Name: Z to A'
} as const;

const SORT_CONFIGS: Record<
  (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS],
  SortConfig
> = {
  [SORT_OPTIONS.FEATURED]: { sortBy: 'featured', sortOrder: 'desc' },
  [SORT_OPTIONS.PRICE_LOW_HIGH]: { sortBy: 'price', sortOrder: 'asc' },
  [SORT_OPTIONS.PRICE_HIGH_LOW]: { sortBy: 'price', sortOrder: 'desc' },
  [SORT_OPTIONS.RATING_HIGH_LOW]: { sortBy: 'rating', sortOrder: 'desc' },
  [SORT_OPTIONS.NAME_A_Z]: { sortBy: 'title', sortOrder: 'asc' },
  [SORT_OPTIONS.NAME_Z_A]: { sortBy: 'title', sortOrder: 'desc' }
} as const;

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" #dropdownContainer>
      <button
        (click)="$event.stopPropagation(); isOpen.set(!isOpen())"
        class="flex items-center justify-between space-x-2 w-full md:w-auto px-4 py-2.5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        [class.bg-gray-50]="isOpen()"
      >
        <span class="text-gray-700">Sort by: {{ currentFilter() }}</span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 text-gray-500 transition-transform duration-200"
          viewBox="0 0 32 32"
          fill="currentColor"
          [class.transform]="isOpen()"
          [class.rotate-180]="isOpen()"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      @if (isOpen()) {
        <div
          class="absolute left-0 right-0 md:left-auto md:right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-100"
        >
          @for (filter of filters; track filter) {
            <button
              (click)="selectFilter(filter)"
              class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
              [class.bg-blue-50]="currentFilter() === filter"
              [class.text-blue-600]="currentFilter() === filter"
            >
              <div class="flex items-center justify-between">
                <span>{{ filter }}</span>
                @if (currentFilter() === filter) {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                }
              </div>
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
      }

      @media (min-width: 768px) {
        :host {
          width: auto;
        }
      }
    `
  ]
})
export class FilterDropdownComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  protected readonly isOpen = signal(false);
  protected readonly currentFilter = signal<
    (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
  >(SORT_OPTIONS.FEATURED);
  protected readonly filters = Object.values(SORT_OPTIONS);

  private readonly clickOutsideHandler = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('app-filter-dropdown')) {
      this.isOpen.set(false);
    }
  };

  ngOnInit(): void {
    document.addEventListener('click', this.clickOutsideHandler);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  protected selectFilter(
    filter: (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS]
  ): void {
    this.currentFilter.set(filter);
    this.isOpen.set(false);

    const config = SORT_CONFIGS[filter];
    this.store.dispatch(setProductPagination(config));
  }
}
