import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectCategories } from '../../store/product/product.selectors';
import { CategoriesFilterComponent } from './categories-filter.component';

describe('CategoriesFilterComponent', () => {
  let component: CategoriesFilterComponent;
  let fixture: ComponentFixture<CategoriesFilterComponent>;
  let store: MockStore;

  const mockCategories = ['electronics', 'clothing', 'books'];
  const initialState = {
    products: {
      categories: mockCategories
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesFilterComponent, RouterTestingModule],
      providers: [
        provideMockStore({
          initialState,
          selectors: [{ selector: selectCategories, value: mockCategories }]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CategoriesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "All Products" link', () => {
    const allProductsLink =
      fixture.nativeElement.querySelector('a[routerLink="/"]');
    expect(allProductsLink).toBeTruthy();
    expect(allProductsLink?.textContent?.trim() || '').toBe('All Products');
  });

  it('should apply active class to selected category', () => {
    const categoryLinks = fixture.nativeElement.querySelectorAll('a');

    categoryLinks.forEach((link: HTMLAnchorElement) => {
      expect(link.classList.contains('text-blue-600')).toBeFalse();
    });

    const firstCategoryLink = categoryLinks[1] as HTMLAnchorElement;
    firstCategoryLink.classList.add('text-blue-600');

    expect(firstCategoryLink.classList.contains('text-blue-600')).toBeTrue();
  });

  it('should have proper styling classes', () => {
    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.classList.contains('bg-white')).toBeTrue();
    expect(nav.classList.contains('shadow-sm')).toBeTrue();

    const container = nav.querySelector('.container');
    expect(container.classList.contains('mx-auto')).toBeTrue();
    expect(container.classList.contains('px-4')).toBeTrue();

    const linksContainer = container.querySelector('.flex');
    expect(linksContainer.classList.contains('items-center')).toBeTrue();
    expect(linksContainer.classList.contains('space-x-4')).toBeTrue();
    expect(linksContainer.classList.contains('overflow-x-auto')).toBeTrue();
  });

  it('should capitalize category names', () => {
    const categoryLinks = fixture.nativeElement.querySelectorAll(
      'a:not([routerLink="/"])'
    );
    categoryLinks.forEach((link: HTMLAnchorElement) => {
      expect(link.classList.contains('capitalize')).toBeTrue();
    });
  });

  it('should handle empty categories array', () => {
    store.overrideSelector(selectCategories, []);
    store.refreshState();
    fixture.detectChanges();

    const categoryLinks = fixture.nativeElement.querySelectorAll(
      'a:not([routerLink="/"])'
    );
    expect(categoryLinks.length).toBe(0);

    const allProductsLink =
      fixture.nativeElement.querySelector('a[routerLink="/"]');
    expect(allProductsLink).toBeTruthy();
  });
});
