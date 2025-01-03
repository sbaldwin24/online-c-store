import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';

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
  selector: 'app-search-filters',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatSliderModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-4">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Filters</h2>

      <!-- Categories -->
      <div class="mb-6">
        <mat-tab-group
          [selectedIndex]="selectedCategoryIndex()"
          (selectedIndexChange)="onCategoryChange($event)"
          class="category-tabs"
        >
          <mat-tab label="All">
            <ng-template matTabContent>
              <div class="p-2">
                <span class="text-sm text-gray-600">All Categories</span>
              </div>
            </ng-template>
          </mat-tab>
          @for (category of categories; track category) {
            <mat-tab [label]="category">
              <ng-template matTabContent>
                <div class="p-2">
                  <span class="text-sm text-gray-600">{{ category }}</span>
                </div>
              </ng-template>
            </mat-tab>
          }
        </mat-tab-group>
      </div>

      <!-- Price Range -->
      <div class="mb-6">
        <h3 class="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
        <div class="space-y-4">
          <mat-slider
            min="0"
            max="1000"
            step="10"
            discrete
            [displayWith]="formatPrice"
          >
            <input
              matSliderStartThumb
              [(ngModel)]="priceRange.min"
              (ngModelChange)="onPriceChange()"
            />
            <input
              matSliderEndThumb
              [(ngModel)]="priceRange.max"
              (ngModelChange)="onPriceChange()"
            />
          </mat-slider>
          <div class="flex justify-between text-sm text-gray-600">
            <span>\${{ priceRange.min || 0 }}</span>
            <span>\${{ priceRange.max || 1000 }}</span>
          </div>
        </div>
      </div>

      <!-- Rating Filter -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 mb-2">Rating</h3>
        <mat-slider
          min="0"
          max="5"
          step="0.5"
          discrete
          [displayWith]="formatRating"
        >
          <input
            matSliderThumb
            [(ngModel)]="selectedRating"
            (ngModelChange)="onRatingChange()"
          />
        </mat-slider>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-width: 250px;
      }

      ::ng-deep .category-tabs .mat-mdc-tab {
        min-width: auto;
        padding: 0 16px;
      }

      ::ng-deep .category-tabs .mat-mdc-tab-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }

      ::ng-deep .mat-mdc-slider {
        width: 100%;
      }
    `
  ]
})
export class SearchFiltersComponent {
  @Input() categories: string[] = [];
  @Output() filterChange = new EventEmitter<FilterUpdate>();

  selectedCategoryIndex = signal(0);
  selectedRating: number | null = null;
  priceRange: PriceRange = {
    min: null,
    max: null
  };

  onCategoryChange(index: number) {
    this.selectedCategoryIndex.set(index);
    this.emitFilterUpdate({
      categories: index === 0 ? [] : [this.categories[index - 1]]
    });
  }

  onPriceChange() {
    this.emitFilterUpdate({ priceRange: this.priceRange });
  }

  onRatingChange() {
    this.emitFilterUpdate({ rating: this.selectedRating });
  }

  private emitFilterUpdate(update: FilterUpdate) {
    this.filterChange.emit(update);
  }

  protected formatPrice(value: number): string {
    return `\$${value}`;
  }

  protected formatRating(value: number): string {
    return `${value}★`;
  }
}
