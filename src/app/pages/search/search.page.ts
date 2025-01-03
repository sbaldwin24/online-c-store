import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap
} from 'rxjs';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { Product } from '../../models/product.model';
import { SearchService } from '../../services/search.service';
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
      <div class="flex flex-col gap-6">
        @if (loading()) {
          <div class="flex justify-center items-center py-12">
            <mat-spinner diameter="40" />
          </div>
        } @else {
          <!-- Category Tabs -->
          <mat-tab-group
            [selectedIndex]="selectedTabIndex()"
            (selectedIndexChange)="onTabChange($event)"
            class="bg-white rounded-lg shadow-sm"
            animationDuration="200ms"
          >
            <mat-tab label="All Categories">
              <div class="p-4">
                @if (searchResults().length === 0) {
                  <div class="text-center py-12">
                    <p class="text-gray-500 text-lg">No products found</p>
                    <p class="text-gray-400 mt-2">
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
                  @if (loading()) {
                    <div class="flex justify-center items-center py-12">
                      <mat-spinner diameter="40" />
                    </div>
                  } @else {
                    <div
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                      <app-search-result-card
                        *ngFor="let product of getProductsByCategory(category)"
                        [result]="product"
                      />
                    </div>
                  }
                </div>
              </mat-tab>
            }
          </mat-tab-group>

          <!-- Filters -->
          <div class="flex flex-col md:flex-row gap-4">
            <app-search-filters
              [categories]="categories()"
              (filterChange)="updateFilters($event)"
            />
          </div>
        }
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
  private searchService = inject(SearchService);

  searchResults = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedTabIndex = signal(0);

  selectedCategories = signal<string[]>([]);
  priceRange = signal<PriceRange>({ min: 0, max: 1000 });
  selectedRating = signal<number | null>(null);

  categories = computed(() => {
    const uniqueCategories = [
      ...new Set(this.searchResults().map(p => p.category))
    ];
    return uniqueCategories.sort();
  });

  filteredResults = computed(() => {
    return this.searchResults().filter(product => {
      const categoryMatch =
        this.selectedCategories().length === 0 ||
        this.selectedCategories().includes(product.category);

      const range = this.priceRange();
      const priceMatch =
        (!range.min || product.price >= range.min) &&
        (!range.max || product.price <= range.max);

      const ratingMatch =
        !this.selectedRating() || product.rating >= this.selectedRating()!;

      return categoryMatch && priceMatch && ratingMatch;
    });
  });

  constructor() {
    // Load initial categories and products
    this.loading.set(true);
    this.searchService.getAllProducts().subscribe({
      next: products => {
        this.searchResults.set(products);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });

    // Handle search queries
    effect(() => {
      this.route.queryParams
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(params => params['q'] !== undefined),
          tap(() => this.loading.set(true)),
          switchMap(params => this.searchService.getSearchResults(params['q']))
        )
        .subscribe({
          next: products => {
            this.searchResults.set(products);
            this.loading.set(false);
          },
          error: err => {
            this.error.set(err.message);
            this.loading.set(false);
          }
        });
    });
  }

  onTabChange(index: number) {
    this.selectedTabIndex.set(index);
    this.loading.set(true);

    if (index === 0) {
      // Load all products
      this.searchService.getAllProducts().subscribe({
        next: products => {
          this.searchResults.set(products);
          this.loading.set(false);
        },
        error: err => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      });
    } else {
      // Load products for selected category
      const selectedCategory = this.categories()[index - 1];
      this.searchService.getProductsByCategory(selectedCategory).subscribe({
        next: products => {
          this.searchResults.set(products);
          this.loading.set(false);
        },
        error: err => {
          this.error.set(err.message);
          this.loading.set(false);
        }
      });
    }
  }

  updateFilters(filters: FilterUpdate) {
    if (filters.categories) {
      this.selectedCategories.set(filters.categories);
    }
    if (filters.priceRange) {
      this.priceRange.set(filters.priceRange);
    }
    if (filters.rating !== undefined) {
      this.selectedRating.set(filters.rating);
    }
  }

  protected getProductsByCategory(category: string): Product[] {
    return this.filteredResults().filter(
      product => product.category === category
    );
  }
}
