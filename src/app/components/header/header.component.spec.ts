import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectCartTotalQuantity } from '../../store/cart/cart.selectors';
import { setProductPagination } from '../../store/product/product.actions';
import { FilterDropdownComponent } from '../filter-dropdown/filter-dropdown.component';
import { SearchComponent } from '../search/search.component';
import { HeaderComponent } from './header.component';
import { TestState } from './header.types';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let store: MockStore<TestState>;

  const initialState = {
    cart: {
      totalQuantity: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, SearchComponent, FilterDropdownComponent],
      providers: [
        provideRouter([]),
        provideMockStore({
          initialState,
          selectors: [{ selector: selectCartTotalQuantity, value: 0 }]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
    document.body.classList.remove('menu-open');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Desktop Layout', () => {
    it('should display the store name', () => {
      const storeName = fixture.nativeElement.querySelector('.text-2xl');
      expect(storeName.textContent.trim()).toContain('Online C Store');
    });

    it('should include search component', () => {
      const searchComponent = fixture.nativeElement.querySelector('app-search');
      expect(searchComponent).toBeTruthy();
    });

    it('should include filter dropdown component', () => {
      const filterDropdown = fixture.nativeElement.querySelector(
        'app-filter-dropdown'
      );
      expect(filterDropdown).toBeTruthy();
    });

    it('should display cart icon with badge when items exist', () => {
      store.overrideSelector(selectCartTotalQuantity, 5);
      store.refreshState();
      fixture.detectChanges();

      const cartBadge = fixture.nativeElement.querySelector('.bg-red-500');
      expect(cartBadge.textContent.trim()).toBe('5');
    });

    it('should not display cart badge when no items exist', () => {
      store.overrideSelector(selectCartTotalQuantity, 0);
      store.refreshState();
      fixture.detectChanges();

      const cartBadge = fixture.nativeElement.querySelector('.bg-red-500');
      expect(cartBadge).toBeFalsy();
    });

    it('should reset pagination when clicking store name', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const storeNameLink = fixture.nativeElement.querySelector('a.text-2xl');

      storeNameLink.click();
      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(
        setProductPagination({ page: 0 })
      );
    });
  });

  describe('Mobile Layout', () => {
    it('should toggle menu when clicking menu button', () => {
      const menuButton = fixture.nativeElement.querySelector(
        'button[aria-label="Toggle menu"]'
      );

      menuButton.click();
      fixture.detectChanges();
      expect(component['isMenuOpen']()).toBe(true);
      expect(document.body.classList.contains('menu-open')).toBe(true);

      menuButton.click();
      fixture.detectChanges();
      expect(component['isMenuOpen']()).toBe(false);
      expect(document.body.classList.contains('menu-open')).toBe(false);
    });

    it('should toggle search when clicking search button', () => {
      const searchButton = fixture.nativeElement.querySelector(
        'button[aria-label="Toggle search"]'
      );

      searchButton.click();
      fixture.detectChanges();
      expect(component['isSearchOpen']()).toBe(true);

      searchButton.click();
      fixture.detectChanges();
      expect(component['isSearchOpen']()).toBe(false);
    });

    it('should close search when opening menu', () => {
      // Open search first
      component['isSearchOpen'].set(true);
      fixture.detectChanges();
      expect(component['isSearchOpen']()).toBe(true);

      // Toggle menu
      const menuButton = fixture.nativeElement.querySelector(
        'button[aria-label="Toggle menu"]'
      );
      menuButton.click();
      fixture.detectChanges();

      expect(component['isSearchOpen']()).toBe(false);
      expect(component['isMenuOpen']()).toBe(true);
    });

    it('should close menu when opening search', () => {
      // Open menu first
      component['isMenuOpen'].set(true);
      document.body.classList.add('menu-open');
      fixture.detectChanges();
      expect(component['isMenuOpen']()).toBe(true);

      // Toggle search
      const searchButton = fixture.nativeElement.querySelector(
        'button[aria-label="Toggle search"]'
      );
      searchButton.click();
      fixture.detectChanges();

      expect(component['isMenuOpen']()).toBe(false);
      expect(component['isSearchOpen']()).toBe(true);
      expect(document.body.classList.contains('menu-open')).toBe(false);
    });

    it('should display mobile cart icon with badge when items exist', () => {
      store.overrideSelector(selectCartTotalQuantity, 3);
      store.refreshState();
      fixture.detectChanges();

      const mobileBadge = fixture.nativeElement.querySelector(
        '.md\\:hidden .bg-red-500'
      );
      expect(mobileBadge.textContent.trim()).toBe('3');
    });

    it('should not display mobile cart badge when no items exist', () => {
      store.overrideSelector(selectCartTotalQuantity, 0);
      store.refreshState();
      fixture.detectChanges();

      const mobileBadge = fixture.nativeElement.querySelector(
        '.md\\:hidden .bg-red-500'
      );
      expect(mobileBadge).toBeFalsy();
    });
  });

  describe('GitHub Link', () => {
    it('should have correct GitHub repository link', () => {
      const githubLink = fixture.nativeElement.querySelector(
        'a[href*="github.com"]'
      );
      expect(githubLink.getAttribute('href')).toBe(
        'https://github.com/sbaldwin24/online-c-store'
      );
      expect(githubLink.getAttribute('target')).toBe('_blank');
      expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });
});
