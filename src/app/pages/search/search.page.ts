import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
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
  imports: [CommonModule, SearchFiltersComponent, SearchResultCardComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-4">
        <app-search-filters
          [categories]="categories()"
          (filterChange)="updateFilters($event)"
        />
        <div class="flex-1">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <app-search-result-card
              *ngFor="let product of filteredResults()"
              [result]="product"
            />
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchPageComponent {
  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  searchResults = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  selectedCategories = signal<string[]>([]);
  priceRange = signal<PriceRange>({ min: 0, max: 1000 });
  selectedRating = signal<number | null>(null);

  categories = computed(() => {
    return [...new Set(this.searchResults().map(p => p.category))];
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
    effect(() => {
      this.route.queryParams
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(params => params['q'] !== undefined)
        )
        .subscribe(params => {
          this.loading.set(true);
          this.searchService.getSearchResults(params['q']).subscribe({
            next: (products: Product[]) => {
              this.searchResults.set(products);
              this.loading.set(false);
            },
            error: (err: Error) => {
              this.error.set(err.message);
              this.loading.set(false);
            }
          });
        });
    });
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
}
