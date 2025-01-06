import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { selectCartTotalQuantity } from '../../store/cart/cart.selectors';
import { setProductPagination } from '../../store/product/product.actions';
import { FilterDropdownComponent } from '../filter-dropdown/filter-dropdown.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchComponent, FilterDropdownComponent],
  template: `
    <header class="bg-blue-900 shadow-sm">
      <div class="container mx-auto px-6">
        <!-- Desktop Layout -->
        <div class="hidden md:flex items-center justify-between py-6">
          <a
            routerLink="/"
            class="text-2xl font-black italic text-white hover:text-red-500 min-w-[200px]"
            (click)="resetPagination()"
          >
            Online C Store
          </a>

          <div class="flex-1 mx-12">
            <app-search />
          </div>

          <div class="flex items-center space-x-12">
            <app-filter-dropdown />
            <a
              aria-label="Shopping Cart"
              routerLink="/cart"
              class="text-gray-600 hover:text-gray-800 relative"
            >
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                class="h-[34px] w-[34px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              @if (
                (cartItemsCount$ | async) !== null &&
                (cartItemsCount$ | async)! > 0
              ) {
                <span
                  class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {{ cartItemsCount$ | async }}
                </span>
              }
            </a>
            <a
              href="https://github.com/sbaldwin24/online-c-store"
              target="_blank"
              rel="noopener noreferrer"
              class="text-white hover:text-gray-300"
              aria-label="View source code on GitHub (opens in a new tab)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="h-[34px] w-[34px]"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="md:hidden">
          <!-- Mobile Header -->
          <div class="flex items-center justify-between py-3">
            <button
              (click)="toggleMenu()"
              class="p-2 -ml-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              [attr.aria-expanded]="isMenuOpen()"
              aria-label="Toggle menu"
            >
              @if (isMenuOpen()) {
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
              } @else {
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              }
            </button>

            <a
              routerLink="/"
              class="text-2xl font-black italic text-white hover:text-red-500"
              (click)="resetPagination()"
            >
              Online-C-Store
            </a>

            <div class="flex items-center space-x-1">
              <button
                (click)="toggleSearch()"
                class="p-2 text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                [attr.aria-expanded]="isSearchOpen()"
                aria-label="Toggle search"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <a
                aria-label="Shopping Cart"
                routerLink="/cart"
                class="p-2 text-white hover:text-gray-300 relative focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <svg
                  aria-hidden="true"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                @if (
                  (cartItemsCount$ | async) !== null &&
                  (cartItemsCount$ | async)! > 0
                ) {
                  <span
                    class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {{ cartItemsCount$ | async }}
                  </span>
                }
              </a>
            </div>
          </div>

          <!-- Mobile Search -->
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            [class.h-0]="!isSearchOpen()"
            [class.h-16]="isSearchOpen()"
          >
            <div class="py-2">
              <app-search />
            </div>
          </div>

          <!-- Mobile Menu -->
          <div
            class="overflow-hidden transition-all duration-300 ease-in-out"
            [class.h-0]="!isMenuOpen()"
            [class.h-auto]="isMenuOpen()"
          >
            <div class="py-4 space-y-4 border-t border-blue-800">
              <app-filter-dropdown />
              <a
                href="https://github.com/sbaldwin24/online-c-store"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center space-x-2 px-2 py-2 text-white hover:text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-label="View source code on GitHub (opens in a new tab)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  class="h-6 w-6"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* Prevent body scroll when mobile menu is open */
      :host-context(body.menu-open) {
        overflow: hidden;
      }
    `
  ]
})
export class HeaderComponent {
  private readonly store = inject(Store);
  protected readonly cartItemsCount$ = this.store
    .select(selectCartTotalQuantity)
    .pipe(map((count: number | null): number => count ?? 0));

  // Mobile menu state using signals
  protected readonly isMenuOpen = signal<boolean>(false);
  protected readonly isSearchOpen = signal<boolean>(false);

  protected resetPagination(): void {
    this.store.dispatch(setProductPagination({ page: 0 }));
  }

  protected toggleMenu(): void {
    this.isMenuOpen.update((state: boolean) => !state);
    if (this.isSearchOpen()) {
      this.isSearchOpen.set(false);
    }
    document.body.classList.toggle('menu-open', this.isMenuOpen());
  }

  protected toggleSearch(): void {
    this.isSearchOpen.update((state: boolean) => !state);
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
      document.body.classList.remove('menu-open');
    }
  }
}
