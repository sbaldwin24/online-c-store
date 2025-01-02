import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SearchFiltersComponent } from './search-filters.component';

describe('SearchFiltersComponent', () => {
  let component: SearchFiltersComponent;
  let fixture: ComponentFixture<SearchFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFiltersComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFiltersComponent);
    component = fixture.componentInstance;
    component.categories = ['electronics', 'clothing', 'books'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty filters', () => {
    expect(component.selectedCategories).toEqual([]);
    expect(component.minPrice).toBeNull();
    expect(component.maxPrice).toBeNull();
    expect(component.selectedRating).toBe('');
  });

  it('should emit filter changes when toggling category', () => {
    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    component.toggleCategory('electronics');

    expect(component.selectedCategories).toContain('electronics');
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: ['electronics'],
      priceRange: { min: null, max: null },
      rating: null
    });

    // Toggle same category again should remove it
    component.toggleCategory('electronics');

    expect(component.selectedCategories).not.toContain('electronics');
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: [],
      priceRange: { min: null, max: null },
      rating: null
    });
  });

  it('should emit filter changes when updating price range', () => {
    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    component.minPrice = 10;
    component.maxPrice = 100;
    component.onPriceChange();

    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: [],
      priceRange: { min: 10, max: 100 },
      rating: null
    });
  });

  it('should emit filter changes when updating rating', () => {
    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    component.selectedRating = '4';
    component.onRatingChange();

    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: [],
      priceRange: { min: null, max: null },
      rating: 4
    });
  });

  it('should clear all filters', () => {
    // Set some initial filters
    component.selectedCategories = ['electronics'];
    component.minPrice = 10;
    component.maxPrice = 100;
    component.selectedRating = '4';

    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    component.clearFilters();

    expect(component.selectedCategories).toEqual([]);
    expect(component.minPrice).toBeNull();
    expect(component.maxPrice).toBeNull();
    expect(component.selectedRating).toBe('');
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: [],
      priceRange: { min: null, max: null },
      rating: null
    });
  });

  it('should handle multiple category selections', () => {
    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    component.toggleCategory('electronics');
    component.toggleCategory('clothing');

    expect(component.selectedCategories).toEqual(['electronics', 'clothing']);
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: ['electronics', 'clothing'],
      priceRange: { min: null, max: null },
      rating: null
    });
  });

  it('should handle combined filter changes', () => {
    const filterChangeSpy = spyOn(component.filterChange, 'emit');

    // First set the category
    component.toggleCategory('electronics');

    // Set price range and trigger change
    component.minPrice = 50;
    component.maxPrice = 200;
    component.onPriceChange();

    // Verify price range update
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: ['electronics'],
      priceRange: { min: 50, max: 200 },
      rating: null
    });

    // Clear previous calls to start fresh for next assertion
    filterChangeSpy.calls.reset();

    // Set rating and trigger change
    component.selectedRating = '3';
    component.onRatingChange();

    // Verify final state with all filters
    expect(filterChangeSpy).toHaveBeenCalledWith({
      categories: ['electronics'],
      priceRange: { min: 50, max: 200 },
      rating: 3
    });
  });
});
