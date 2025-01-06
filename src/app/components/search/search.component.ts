import { CommonModule, Location, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  signal,
  ViewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  of,
  Subject,
  switchMap,
  tap
} from 'rxjs';
import { Product } from '../../models/product.model';
import { loadProducts } from '../../store/product/product.actions';
import { selectFilteredProducts } from '../../store/product/product.selectors';

const SEARCH_DEBOUNCE_TIME = 300; // milliseconds

export type SearchContext = 'header' | 'search-page';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage],
  template: `
    @if (context === 'header') {
      <div class="relative w-full">
        <div class="relative">
          <label for="search-input" class="sr-only">Search products</label>
          <input
            #searchInput
            id="search-input"
            type="search"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search products..."
            class="w-full px-3 py-1.5 pr-12 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm transition-all duration-200"
            aria-label="Search products"
            role="searchbox"
            autocomplete="off"
            [attr.aria-expanded]="showSuggestions()"
            [attr.aria-activedescendant]="activeDescendant()"
            (keydown)="handleKeydown($event)"
            (blur)="onBlur()"
          />
          @if (isSearching()) {
            <div class="absolute right-12 top-1/2 -translate-y-1/2">
              <div
                class="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"
              ></div>
            </div>
          }
          <button
            (click)="handleSearch()"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Search"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-4 h-4"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        @if (showSuggestions() && searchQuery().length >= 2) {
          <div
            class="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-96 overflow-auto transform opacity-100 scale-100 transition-all duration-200"
            role="listbox"
          >
            @if (suggestions().length > 0) {
              @for (
                suggestion of suggestions();
                track suggestion.id;
                let i = $index
              ) {
                <button
                  class="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors flex items-center space-x-3 group"
                  role="option"
                  [attr.aria-selected]="i === activeIndex()"
                  [id]="'suggestion-' + i"
                  (mouseenter)="activeIndex.set(i)"
                  (click)="selectSuggestion(suggestion)"
                >
                  <div
                    class="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0"
                  >
                    <img
                      [ngSrc]="suggestion.thumbnail"
                      [alt]="suggestion.title"
                      [width]="40"
                      [height]="40"
                      class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <div class="flex-grow min-w-0">
                    <div
                      class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200"
                      [innerHTML]="highlightMatch(suggestion.title)"
                    ></div>
                    <div class="text-sm text-gray-500 truncate">
                      {{ suggestion.category }}
                    </div>
                  </div>
                  <div class="text-blue-600 font-medium whitespace-nowrap">
                    \${{ suggestion.price }}
                  </div>
                </button>
              }
            } @else if (searchQuery() && !isSearching()) {
              <div class="p-6 text-center">
                <div class="text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="w-6 h-6 mx-auto"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p class="text-gray-500">
                  No results found for "<span class="font-medium">{{
                    searchQuery()
                  }}</span
                  >"
                </p>
                <p class="text-sm text-gray-400 mt-1">
                  Try different keywords or check the spelling
                </p>
              </div>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      input[type='search']::-webkit-search-cancel-button {
        -webkit-appearance: none;
        appearance: none;
      }

      .highlight {
        background-color: rgba(59, 130, 246, 0.1);
        color: rgb(37, 99, 235);
        padding: 0.1em 0;
        border-radius: 2px;
      }

      /* Custom scrollbar styles */
      div[role='listbox'] {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
      }

      div[role='listbox']::-webkit-scrollbar {
        width: 6px;
      }

      div[role='listbox']::-webkit-scrollbar-track {
        background: transparent;
      }

      div[role='listbox']::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
      }

      div[role='listbox']::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
      }
    `
  ]
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() context: SearchContext = 'header';
  @Output() search = new EventEmitter<string>();
  @Output() suggestionSelected = new EventEmitter<Product>();
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  protected readonly searchQuery = signal('');
  protected readonly isSearching = signal(false);
  protected readonly suggestions = signal<Product[]>([]);
  protected readonly showSuggestions = signal(false);
  protected readonly activeIndex = signal(-1);
  protected readonly activeDescendant = computed(() =>
    this.activeIndex() >= 0 ? `suggestion-${this.activeIndex()}` : ''
  );
  protected readonly isSearchPage = signal(false);

  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();
  private readonly store = inject(Store);
  private readonly location = inject(Location);
  private isItemSelected = false;
  private readonly renderer = inject(Renderer2);

  constructor() {
    // Ensure products are loaded
    this.store.dispatch(loadProducts());

    // Effect to handle route changes and suggestions visibility
    effect(
      () => {
        const currentUrl = this.router.url;
        this.showSuggestions.set(false);
        this.suggestions.set([]);
        if (currentUrl.includes('/search')) {
          this.isSearching.set(false);
          this.deactivateSearch();
        }
      },
      { allowSignalWrites: true }
    );

    // Handle all navigation events
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Always hide suggestions and remove focus during any navigation event
        this.showSuggestions.set(false);
        this.suggestions.set([]);
        this.isSearching.set(false);

        if (this.searchInput?.nativeElement) {
          this.searchInput.nativeElement.blur();
        }
      });

    // Set up debounced search
    this.searchSubject
      .pipe(
        debounceTime(SEARCH_DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(() => {
          if (this.router.url.includes('/search')) {
            this.isSearching.set(false);
            return;
          }
          this.isSearching.set(true);
        }),
        switchMap(query =>
          query.length >= 2
            ? this.store.select(selectFilteredProducts(query)).pipe(
                map(products => products.slice(0, 8)),
                delay(300)
              )
            : of([])
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(results => {
        this.isSearching.set(false);
        if (this.router.url.includes('/search')) {
          this.showSuggestions.set(false);
          this.suggestions.set([]);
          return;
        }

        this.suggestions.set(results);
        this.showSuggestions.set(true);
        this.activeIndex.set(-1);
      });
  }

  ngOnInit() {
    // Subscribe to router events to clear search when navigating away from search page
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: NavigationEnd) => {
        // Clear search if not on search page
        if (!event.url.startsWith('/search')) {
          this.clearSearch();
        }
      });
  }

  ngOnDestroy() {
    // Ensure suggestions are hidden when component is destroyed
    this.showSuggestions.set(false);
    this.suggestions.set([]);
  }

  ngAfterViewInit() {
    // Subscribe to router events to handle search deactivation
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.router.url.includes('/search')) {
          this.deactivateSearch();
        }
      });
  }

  protected handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const currentIndex = this.activeIndex();
        const maxIndex = this.suggestions().length - 1;
        this.activeIndex.set(currentIndex < maxIndex ? currentIndex + 1 : 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        const idx = this.activeIndex();
        const maxIdx = this.suggestions().length - 1;
        this.activeIndex.set(idx > 0 ? idx - 1 : maxIdx);
        break;
      case 'Enter':
        event.preventDefault();
        const activeIndex = this.activeIndex();
        if (activeIndex >= 0) {
          this.selectSuggestion(this.suggestions()[activeIndex]);
        } else {
          this.handleSearch();
        }
        break;
      case 'Escape':
        this.clearSearch();
        break;
    }
  }

  protected onSearchChange(query: string): void {
    this.searchQuery.set(query);
    if (query.length >= 2) {
      this.isSearching.set(true);
      this.searchSubject.next(query);
    } else {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
    }
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.search.emit('');
  }

  protected onBlur(): void {
    // Only hide suggestions if we haven't just selected an item
    if (!this.isItemSelected) {
      setTimeout(() => {
        this.showSuggestions.set(false);
      }, 200);
    }
  }

  protected selectSuggestion(suggestion: Product): void {
    this.isItemSelected = true;
    this.searchQuery.set(suggestion.title);
    this.showSuggestions.set(false);
    this.suggestions.set([]);

    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.blur();
    }

    this.suggestionSelected.emit(suggestion);
    this.router.navigate(['/product', suggestion.id]);

    // Reset the flag after a short delay
    setTimeout(() => {
      this.isItemSelected = false;
    }, 300);
  }

  protected highlightMatch(text: string): string {
    const searchTerm = this.searchQuery().toLowerCase();
    const index = text.toLowerCase().indexOf(searchTerm);
    if (index === -1) return text;

    return (
      text.slice(0, index) +
      `<span class="highlight">${text.slice(index, index + searchTerm.length)}</span>` +
      text.slice(index + searchTerm.length)
    );
  }

  protected handleSearch(): void {
    if (!this.searchQuery()) return;

    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.isSearching.set(false);

    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.blur();
    }

    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery() }
    });
  }

  protected isSearchRoute(): boolean {
    return this.location.path().startsWith('/search');
  }

  private deactivateSearch(): void {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.blur();

      // Force body to be active
      const body = document.body;
      this.renderer.setAttribute(body, 'tabindex', '-1');
      body.focus();
      this.renderer.removeAttribute(body, 'tabindex');

      // Prevent search input from getting focus
      const preventFocus = (e: Event) => {
        e.preventDefault();
        body.focus();
      };

      this.searchInput.nativeElement.addEventListener('focus', preventFocus);
      setTimeout(() => {
        this.searchInput.nativeElement.removeEventListener(
          'focus',
          preventFocus
        );
      }, 500);
    }

    // Clear all states
    this.showSuggestions.set(false);
    this.suggestions.set([]);
    this.isSearching.set(false);
  }
}
