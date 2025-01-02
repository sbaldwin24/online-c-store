import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Filters</h3>
      <div class="mb-6">
        <h4 class="font-medium mb-2">Categories</h4>
        @for (category of categories; track category) {
          <div class="flex items-center mb-2">
            <input
              type="checkbox"
              [id]="category"
              [checked]="selectedCategories.includes(category)"
              (change)="toggleCategory(category)"
              class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label [for]="category" class="ml-2 text-gray-700 capitalize">
              {{ category }}
            </label>
          </div>
        }
      </div>
      <div class="mb-6">
        <h4 class="font-medium mb-2">Price Range</h4>
        <div class="flex items-center space-x-2">
          <input
            type="number"
            [(ngModel)]="minPrice"
            (ngModelChange)="onPriceChange()"
            placeholder="Min"
            class="w-24 px-2 py-1 border rounded"
          />
          <span>-</span>
          <input
            type="number"
            [(ngModel)]="maxPrice"
            (ngModelChange)="onPriceChange()"
            placeholder="Max"
            class="w-24 px-2 py-1 border rounded"
          />
        </div>
      </div>

      <div class="mb-6">
        <h4 class="font-medium mb-2">Minimum Rating</h4>
        <select
          [(ngModel)]="selectedRating"
          (ngModelChange)="onRatingChange()"
          class="w-full p-2 border rounded"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Star</option>
        </select>
      </div>

      <button
        (click)="clearFilters()"
        class="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  `
})
export class SearchFiltersComponent {
  @Input() categories: string[] = [];
  @Output() filterChange = new EventEmitter<{
    categories: string[];
    priceRange: { min: number | null; max: number | null };
    rating: number | null;
  }>();

  selectedCategories: string[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedRating: string = '';

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.emitFilters();
  }

  onPriceChange(): void {
    this.emitFilters();
  }

  onRatingChange(): void {
    this.emitFilters();
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRating = '';
    this.emitFilters();
  }

  private emitFilters(): void {
    this.filterChange.emit({
      categories: this.selectedCategories,
      priceRange: {
        min: this.minPrice,
        max: this.maxPrice
      },
      rating: this.selectedRating ? Number(this.selectedRating) : null
    });
  }
}
