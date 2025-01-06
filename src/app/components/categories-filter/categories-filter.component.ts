import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCategories } from '../../store/product/product.selectors';

@Component({
  selector: 'app-categories-filter',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  template: `
    <mat-tab-group
      class="bg-white rounded-lg shadow-md"
      animationDuration="200ms"
      (selectedIndexChange)="onTabChange($event)"
    >
      <mat-tab label="All Products"> </mat-tab>
      @for (category of categories$ | async; track category) {
        <mat-tab [label]="category"> </mat-tab>
      }
    </mat-tab-group>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      ::ng-deep .mat-mdc-tab-header {
        background-color: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 0.5rem 0.5rem 0 0;
      }

      ::ng-deep .mat-mdc-tab-group {
        border-radius: 0.5rem;
        overflow: hidden;
      }

      ::ng-deep .mat-mdc-tab {
        font-family: 'Lato', sans-serif !important;
        min-width: 120px;
      }

      ::ng-deep .mdc-tab__text-label {
        font-family: 'Lato', sans-serif !important;
        font-size: 1.25rem;
        font-weight: 600;
        text-transform: capitalize;
      }

      ::ng-deep .mat-mdc-tab-label-content {
        font-family: 'Lato', sans-serif !important;
        font-size: 1.25rem;
        font-weight: 600;
      }

      ::ng-deep .mdc-tab-indicator__content {
        font-family: 'Lato', sans-serif !important;
        font-size: 1.25rem;
        font-weight: 600;
      }
    `
  ]
})
export class CategoriesFilterComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  protected readonly categories$ = this.store.select(selectCategories);

  protected onTabChange(index: number): void {
    if (index === 0) {
      this.router.navigate(['/']);
    } else {
      const categories = this.store.select(selectCategories);
      categories
        .subscribe(cats => {
          if (cats && cats.length >= index) {
            this.router.navigate(['/category', cats[index - 1]]);
          }
        })
        .unsubscribe();
    }
  }
}
