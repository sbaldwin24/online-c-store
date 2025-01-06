import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { Product } from '../../models/product.model';
import { loadProducts } from '../../store/product/product.actions';
import {
  selectFilteredProducts,
  selectLoading
} from '../../store/product/product.selectors';
import { SearchResultCardComponent } from './components/search-result-card/search-result-card.component';

interface PriceRange {
  min: number | null;
  max: number | null;
}

interface FilterUpdate {
  categories?: string[];
  priceRange?: PriceRange;
  rating?: number | null;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    SearchFiltersComponent,
    SearchResultCardComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-6">
        <!-- Filters Sidebar -->
        <div class="hidden md:block w-64 flex-shrink-0">
          <div class="sticky top-4">
            <app-search-filters
              [categories]="uniqueCategories()"
              (filterChange)="updateFilters($event)"
            />
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <div class="flex flex-col gap-6">
            @if (error()) {
              <div
                class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span class="block sm:inline">{{ error() }}</span>
              </div>
            }
            @if (isLoading()) {
              <div class="flex justify-center items-center py-12">
                <mat-spinner diameter="40" />
              </div>
            } @else {
              <mat-tab-group
                [selectedIndex]="selectedCategoryIndex()"
                (selectedIndexChange)="onTabChange($event)"
                class="bg-white rounded-lg shadow-sm"
                animationDuration="200ms"
              >
                <mat-tab label="All Categories">
                  <div class="p-4">
                    @if (searchResults().length === 0) {
                      <div class="text-center py-12">
                        <p class="text-gray-700 text-lg">
                          No products found for "{{ searchQuery() }}"
                        </p>
                        <p class="text-gray-700 mt-2">
                          Try a different search term
                        </p>
                      </div>
                    } @else {
                      <div
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                      >
                        <app-search-result-card
                          *ngFor="let product of filteredResults()"
                          [result]="product"
                        />
                      </div>
                    }
                  </div>
                </mat-tab>
                @for (category of categories(); track category) {
                  <mat-tab [label]="category">
                    <div class="p-4">
                      @if (isLoading()) {
                        <div class="flex justify-center items-center py-12">
                          <mat-spinner diameter="40" />
                        </div>
                      } @else {
                        <div
                          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                          <app-search-result-card
                            *ngFor="
                              let product of getProductsByCategory(category)
                            "
                            [result]="product"
                          />
                        </div>
                      }
                    </div>
                  </mat-tab>
                }
              </mat-tab-group>

              <!-- Mobile Filters Button -->
              <button
                class="md:hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                (click)="showMobileFilters.set(true)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </button>

              <!-- Mobile Filters Dialog -->
              @if (showMobileFilters()) {
                <div
                  class="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                  (click)="showMobileFilters.set(false)"
                >
                  <div
                    class="absolute right-0 top-0 h-full w-80 bg-white p-4 transform transition-transform"
                    (click)="$event.stopPropagation()"
                  >
                    <div class="flex justify-between items-center mb-4">
                      <h2 class="text-lg font-semibold">Filters</h2>
                      <button
                        class="text-gray-500 hover:text-gray-700"
                        (click)="showMobileFilters.set(false)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <app-search-filters
                      [categories]="uniqueCategories()"
                      (filterChange)="updateFilters($event)"
                    />
                  </div>
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      ::ng-deep .mat-mdc-tab-header {
        background-color: white;
        border-radius: 0.5rem 0.5rem 0 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      ::ng-deep .mat-mdc-tab-group {
        overflow: hidden;
        border-radius: 0.5rem;
      }

      ::ng-deep .mat-mdc-tab {
        min-width: 120px;
      }
    `
  ]
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  searchResults = signal<Product[]>([]);
  isLoading = signal(false);
  searchQuery = signal('');
  selectedCategoryIndex = signal(0);
  error = signal<string | null>(null);
  showDropdown = signal(false);
  showMobileFilters = signal(false);

  filters = signal<FilterUpdate>({
    categories: [],
    priceRange: { min: null, max: null },
    rating: null
  });

  categories = computed(() => this.uniqueCategories());

  uniqueCategories = computed(() => {
    const categories = new Set<string>();
    for (const product of this.searchResults()) {
      categories.add(product.category);
    }
    return Array.from(categories).sort();
  });

  filteredResults = computed(() =>
    this.applyFilters(this.searchResults(), this.filters())
  );

  categoryProducts = computed(() => {
    const selectedCategory = this.getSelectedCategory();
    if (selectedCategory) {
      return this.applyFilters(
        this.searchResults().filter(p => p.category === selectedCategory),
        this.filters()
      );
    } else {
      return this.filteredResults();
    }
  });

  constructor() {
    // Ensure products are loaded
    this.store.dispatch(loadProducts());

    // Subscribe to loading state
    this.store.select(selectLoading).subscribe(loading => {
      this.isLoading.set(loading);
    });

    effect(() => {
      return this.route.queryParams
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          map(params => params['q'] || ''),
          startWith(this.route.snapshot.queryParams['q'] || '')
        )
        .subscribe({
          next: query => {
            this.searchQuery.set(query);
            if (query) {
              this.performSearch(query);
            }
          },
          error: err => {
            this.error.set(err.message || 'Failed to process search query');
            this.isLoading.set(false);
          }
        });
    });

    // Close dropdown when clicking outside
    effect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.search-container')) {
          this.showDropdown.set(false);
        }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    });
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.showDropdown.set(true);

    if (query) {
      this.performSearch(query);
    } else {
      this.searchResults.set([]);
    }
  }

  selectProduct(product: Product) {
    this.showDropdown.set(false);
    this.searchQuery.set(product.title);
    this.router.navigate(['/product', product.id]);
  }

  private performSearch(query: string) {
    this.isLoading.set(true);
    this.error.set(null);

    this.store.select(selectFilteredProducts(query)).subscribe({
      next: products => {
        this.searchResults.set(products);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set(err.message || 'Failed to search products');
        this.isLoading.set(false);
      }
    });
  }

  getProductsByCategory(category: string): Product[] {
    return this.categoryProducts().filter(
      product => product.category === category
    );
  }

  onTabChange(index: number): void {
    this.selectedCategoryIndex.set(index);
    this.updateRoute();
  }

  updateFilters(filters: FilterUpdate) {
    this.filters.set(filters);
    this.updateRoute();
  }

  private updateRoute(): void {
    const queryParams: any = { q: this.searchQuery() };
    const selectedCategory = this.getSelectedCategory();

    if (selectedCategory) {
      queryParams.category = selectedCategory;
    }

    const filters = this.filters();
    if (filters.categories && filters.categories.length > 0) {
      queryParams.categories = filters.categories.join(',');
    }
    if (filters.priceRange) {
      if (filters.priceRange.max) {
        queryParams.maxPrice = filters.priceRange.max;
      }
    }
    if (filters.rating) {
      queryParams.rating = filters.rating;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private getSelectedCategory(): string | null {
    const index = this.selectedCategoryIndex();
    return index > 0 ? this.uniqueCategories()[index - 1] : null;
  }

  private applyFilters(products: Product[], filters: FilterUpdate): Product[] {
    return products.filter(product => {
      const categoryMatch =
        !filters.categories ||
        filters.categories.length === 0 ||
        filters.categories.includes(product.category);
      const priceMatch =
        (!filters.priceRange?.min || product.price >= filters.priceRange.min) &&
        (!filters.priceRange?.max || product.price <= filters.priceRange.max);
      const ratingMatch = !filters.rating || product.rating >= filters.rating;
      return categoryMatch && priceMatch && ratingMatch;
    });
  }
}
