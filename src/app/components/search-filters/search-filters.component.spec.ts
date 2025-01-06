import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFiltersComponent } from './search-filters.component';

describe('SearchFiltersComponent', () => {
  let component: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFiltersComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.categories).toEqual([]);
    expect(component.selectedCategories).toEqual([]);
    expect(component.priceRange).toEqual({ min: null, max: null });
    expect(component.selectedRating).toBe(0);
    expect(component.selectedCategoryIndex()).toBe(0);
  });

  describe('Category handling', () => {
    it('should emit filterChange when toggling a category (add category)', () => {
      const spy = spyOn(component.filterChange, 'emit');
      component.toggleCategory('Electronics');
      expect(component.selectedCategories).toEqual(['Electronics']);
      expect(spy).toHaveBeenCalledWith({ categories: ['Electronics'] });
    });

    it('should emit filterChange when toggling a category (remove category)', () => {
      component.selectedCategories = ['Electronics'];
      const spy = spyOn(component.filterChange, 'emit');
      component.toggleCategory('Electronics');
      expect(component.selectedCategories).toEqual([]);
      expect(spy).toHaveBeenCalledWith({ categories: [] });
    });

    it('should change selectedCategoryIndex and emit correct categories (onCategoryChange)', () => {
      component.categories = ['Cat1', 'Cat2'];
      const spy = spyOn(component.filterChange, 'emit');

      component.onCategoryChange(0);
      expect(component.selectedCategoryIndex()).toBe(0);
      expect(spy).toHaveBeenCalledWith({ categories: [] });

      component.onCategoryChange(1);
      expect(component.selectedCategoryIndex()).toBe(1);
      expect(spy).toHaveBeenCalledWith({ categories: ['Cat1'] });

      component.onCategoryChange(2);
      expect(component.selectedCategoryIndex()).toBe(2);
      expect(spy).toHaveBeenCalledWith({ categories: ['Cat2'] });
    });
  });

  describe('Price handling', () => {
    it('should emit filterChange when price changes', () => {
      const spy = spyOn(component.filterChange, 'emit');
      component.priceRange.min = 100;
      component.priceRange.max = 500;
      component.onPriceChange();
      expect(spy).toHaveBeenCalledWith({
        priceRange: { min: 100, max: 500 }
      });
    });
  });

  describe('Rating handling', () => {
    it('should emit filterChange when rating changes (above 0)', () => {
      const spy = spyOn(component.filterChange, 'emit');
      component.selectedRating = 4.5;
      component.onRatingChange();
      expect(spy).toHaveBeenCalledWith({ rating: 4.5 });
    });

    it('should emit filterChange when rating is 0', () => {
      const spy = spyOn(component.filterChange, 'emit');
      component.selectedRating = 0;
      component.onRatingChange();
      expect(spy).toHaveBeenCalledWith({ rating: 0 });
    });
  });

  describe('Clearing filters', () => {
    it('should clear all filters and emit the defaults', () => {
      component.selectedCategories = ['Electronics', 'Books'];
      component.priceRange = { min: 100, max: 300 };
      component.selectedRating = 3;
      component.selectedCategoryIndex.set(2);

      const spy = spyOn(component.filterChange, 'emit');
      component.clearFilters();

      expect(component.selectedCategories).toEqual([]);
      expect(component.priceRange).toEqual({ min: null, max: null });
      expect(component.selectedRating).toBe(0);
      expect(component.selectedCategoryIndex()).toBe(0);

      expect(spy).toHaveBeenCalledWith({
        categories: [],
        priceRange: { min: null, max: null },
        rating: 0
      });
    });
  });
});
