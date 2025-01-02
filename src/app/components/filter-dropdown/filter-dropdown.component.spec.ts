import { Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { setProductPagination } from '../../store/product/product.actions';
import { FilterDropdownComponent } from './filter-dropdown.component';

describe('FilterDropdownComponent', () => {
  let component: FilterDropdownComponent;
  let fixture: ComponentFixture<FilterDropdownComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDropdownComponent],
      providers: [
        provideMockStore({
          initialState: {}
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(FilterDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const isOpen = component['isOpen'] as Signal<boolean>;
    const currentFilter = component['currentFilter'] as Signal<string>;
    expect(isOpen()).toBeFalse();
    expect(currentFilter()).toBe('Featured');
  });

  it('should display current filter text', () => {
    const filterText = fixture.nativeElement.querySelector('span');
    expect(filterText.textContent.trim()).toBe('Sort by: Featured');
  });

  it('should close dropdown when clicking outside', async () => {
    const isOpen = component['isOpen'] as Signal<boolean>;
    (component['isOpen'] as { set(value: boolean): void }).set(true);
    fixture.detectChanges();
    expect(isOpen()).toBeTrue();

    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    outsideElement.dispatchEvent(event);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(isOpen()).toBeFalse();
    document.body.removeChild(outsideElement);
  });

  it('should update filter and dispatch action when selecting price low to high', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    (component['isOpen'] as { set(value: boolean): void }).set(true);
    fixture.detectChanges();

    component['selectFilter']('Price: Low to High');
    fixture.detectChanges();

    const currentFilter = component['currentFilter'] as Signal<string>;
    const isOpen = component['isOpen'] as Signal<boolean>;
    expect(currentFilter()).toBe('Price: Low to High');
    expect(isOpen()).toBeFalse();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setProductPagination({ sortBy: 'price', sortOrder: 'asc' })
    );
  });

  it('should update filter and dispatch action when selecting price high to low', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    (component['isOpen'] as { set(value: boolean): void }).set(true);
    fixture.detectChanges();

    component['selectFilter']('Price: High to Low');
    fixture.detectChanges();

    const currentFilter = component['currentFilter'] as Signal<string>;
    const isOpen = component['isOpen'] as Signal<boolean>;
    expect(currentFilter()).toBe('Price: High to Low');
    expect(isOpen()).toBeFalse();
    expect(dispatchSpy).toHaveBeenCalledWith(
      setProductPagination({ sortBy: 'price', sortOrder: 'desc' })
    );
  });
});
