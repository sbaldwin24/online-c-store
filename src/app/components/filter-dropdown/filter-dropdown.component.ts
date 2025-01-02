import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { setProductPagination } from '../../store/product/product.actions';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" #dropdownContainer>
      <button
        (click)="$event.stopPropagation(); isOpen.set(!isOpen())"
        class="flex items-center space-x-1 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span>Sort by: {{ currentFilter() }}</span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
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
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
        >
          @for (filter of filters; track filter) {
            <button
              (click)="selectFilter(filter)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
              [class.text-blue-600]="currentFilter() === filter"
            >
              {{ filter }}
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
      }
    `
  ]
})
export class FilterDropdownComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  protected readonly isOpen = signal(false);
  protected readonly currentFilter = signal('Featured');
  protected readonly filters = [
    'Featured',
    'Price: Low to High',
    'Price: High to Low',
    'Rating: High to Low',
    'Name: A to Z',
    'Name: Z to A'
  ];

  private clickOutsideHandler = (event: MouseEvent) => {
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

  protected selectFilter(filter: string): void {
    this.currentFilter.set(filter);
    this.isOpen.set(false);

    switch (filter) {
      case 'Price: Low to High':
        this.store.dispatch(
          setProductPagination({ sortBy: 'price', sortOrder: 'asc' })
        );
        break;
      case 'Price: High to Low':
        this.store.dispatch(
          setProductPagination({ sortBy: 'price', sortOrder: 'desc' })
        );
        break;
      case 'Rating: High to Low':
        this.store.dispatch(
          setProductPagination({ sortBy: 'rating', sortOrder: 'desc' })
        );
        break;
      case 'Name: A to Z':
        this.store.dispatch(
          setProductPagination({ sortBy: 'title', sortOrder: 'asc' })
        );
        break;
      case 'Name: Z to A':
        this.store.dispatch(
          setProductPagination({ sortBy: 'title', sortOrder: 'desc' })
        );
        break;
      default:
        this.store.dispatch(
          setProductPagination({ sortBy: 'featured', sortOrder: 'desc' })
        );
    }
  }
}
