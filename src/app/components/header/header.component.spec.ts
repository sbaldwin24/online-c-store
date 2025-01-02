import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectCartTotalQuantity } from '../../store/cart/cart.selectors';
import { setProductPagination } from '../../store/product/product.actions';
import { FilterDropdownComponent } from '../filter-dropdown/filter-dropdown.component';
import { SearchComponent } from '../search/search.component';
import { HeaderComponent } from './header.component';

interface TestState {
  cart: {
    totalQuantity: number;
  };
}

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo text', () => {
    const logoElement = fixture.nativeElement.querySelector('a.text-3xl');
    expect(logoElement.textContent.trim()).toBe('C-Store');
  });

  it('should display cart icon', () => {
    const cartIcon = fixture.nativeElement.querySelector('svg');
    expect(cartIcon).toBeTruthy();
  });

  it('should not show cart badge when cart is empty', () => {
    store.overrideSelector(selectCartTotalQuantity, 0);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeFalsy();
  });

  it('should show cart badge with correct count when cart has items', () => {
    store.overrideSelector(selectCartTotalQuantity, 5);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('5');
  });

  it('should reset pagination when clicking on logo', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const logoLink = fixture.nativeElement.querySelector('a.text-3xl');

    logoLink.click();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(setProductPagination({ page: 0 }));
  });

  it('should have correct navigation links', () => {
    const links = Array.from(
      fixture.nativeElement.querySelectorAll('a')
    ) as HTMLAnchorElement[];
    const homeLink = links.find(
      link => link.getAttribute('routerLink') === '/'
    );
    const cartLink = links.find(
      link => link.getAttribute('routerLink') === '/cart'
    );

    expect(homeLink).toBeTruthy();
    expect(cartLink).toBeTruthy();
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

  it('should include the GitHub Icon and navigate to the code base when clicked', () => {
    const githubLink = fixture.nativeElement.querySelector(
      'a[href="https://github.com/sbaldwin24/online-c-store"]'
    );
    const githubIcon = githubLink.querySelector('svg');

    expect(githubIcon).toBeTruthy();
    expect(githubIcon.getAttribute('aria-hidden')).toBeNull();

    githubLink.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    expect(githubLink.classList.contains('hover:text-gray-300')).toBeTrue();

    expect(githubLink.getAttribute('href')).toBe(
      'https://github.com/sbaldwin24/online-c-store'
    );
    expect(githubLink.getAttribute('target')).toBe('_blank');
    expect(githubLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should update cart badge when cart quantity changes', () => {
    let badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeFalsy();

    store.overrideSelector(selectCartTotalQuantity, 3);
    store.refreshState();
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge.textContent.trim()).toBe('3');

    store.overrideSelector(selectCartTotalQuantity, 7);
    store.refreshState();
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge.textContent.trim()).toBe('7');
  });

  it('should render shopping cart link with correct item count', () => {
    const cartLink = fixture.nativeElement.querySelector(
      'a[routerLink="/cart"]'
    );

    store.overrideSelector(selectCartTotalQuantity, 3);
    store.refreshState();
    fixture.detectChanges();

    const itemCount = cartLink.querySelector('.bg-red-500');
    expect(cartLink).toBeTruthy();
    expect(itemCount.textContent.trim()).toBe('3');
  });
});
