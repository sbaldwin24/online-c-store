import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectFilteredProducts } from '../../store/product/product.selectors';
import { mockProduct } from '../../testing/test-utils';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;

  const mockProducts = [mockProduct];

  const initialState = {
    product: {
      products: mockProducts,
      categories: [],
      selectedProduct: null,
      loading: false,
      error: null,
      pagination: {
        page: 0,
        pageSize: 12,
        sortBy: 'featured',
        sortOrder: 'desc'
      }
    }
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule, NoopAnimationsModule],
      providers: [
        provideMockStore({
          initialState
        }),
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectFilteredProducts(''), mockProducts);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search query', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(input.nativeElement.value).toBe('');
  });

  it('should show search icon when search query is empty', () => {
    const searchIcon = fixture.debugElement.query(
      By.css('svg path[d*="M21 21l-6-6m2-5a7"]')
    );
    expect(searchIcon).toBeTruthy();
  });

  it('should show clear button when search query is not empty', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300); // Wait for debounce

    const clearButton = fixture.debugElement.query(
      By.css('button[aria-label="Clear search"]')
    );
    expect(clearButton).toBeTruthy();
  }));

  it('should clear search when clear button is clicked', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300); // Wait for debounce

    const clearButton = fixture.debugElement.query(
      By.css('button[aria-label="Clear search"]')
    );
    clearButton.nativeElement.click();
    fixture.detectChanges();

    expect(input.nativeElement.value).toBe('');
  }));

  it('should emit search event with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(300); // Wait for debounce
    expect(searchSpy).toHaveBeenCalledWith('test');
  }));

  it('should not emit search event before debounce time', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    tick(200); // Less than debounce time
    expect(searchSpy).not.toHaveBeenCalled();
  }));

  it('should not emit search event for duplicate queries', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // First search
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);

    // Same search again
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledWith('test');
  }));

  it('should have proper accessibility attributes', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(input.attributes['aria-label']).toBe('Search');

    // Set a search value to show clear button
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(
      By.css('button[aria-label="Clear search"]')
    );
    expect(clearButton.attributes['aria-label']).toBe('Clear search');
  });

  it('should apply correct styles when search query is empty vs not empty', fakeAsync(() => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // Empty state
    expect(input.classes['pl-10']).toBeTrue();
    expect(input.classes['pr-4']).toBeTrue();

    // With search query
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);

    expect(input.classes['pl-10']).toBeTrue();
    expect(input.classes['pr-10']).toBeTrue();
  }));
});
