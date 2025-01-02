// src/app/components/search/search.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        (ngModelChange)="onSearchChange($event)"
        placeholder="Search products..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        (click)="search()"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-5 h-5"
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
  `
})
export class SearchComponent {
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  searchQuery = '';

  constructor() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query: string) => {
        if (query) {
          this.router.navigate(['/search'], { queryParams: { q: query } });
        } else {
          this.router.navigate(['/search']);
        }
      });
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  search(): void {
    this.searchSubject.next(this.searchQuery);
  }
}
