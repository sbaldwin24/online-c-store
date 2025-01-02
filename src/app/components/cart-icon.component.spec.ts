import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectCartTotalQuantity } from '../store/cart/cart.selectors';
import { CartIconComponent } from './cart-icon.component';

describe('CartIconComponent', () => {
  let component: CartIconComponent;
  let fixture: ComponentFixture<CartIconComponent>;
  let store: MockStore;

  const initialState = {
    cart: {
      items: [],
      totalQuantity: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartIconComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            {
              selector: selectCartTotalQuantity,
              value: 0
            }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CartIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display quantity badge when cart is empty', () => {
    store.overrideSelector(selectCartTotalQuantity, 0);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeFalsy();
  });

  it('should display quantity badge when cart has items', () => {
    store.overrideSelector(selectCartTotalQuantity, 5);
    store.refreshState();
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('5');
  });

  it('should update badge when cart quantity changes', () => {
    // Initial state
    store.overrideSelector(selectCartTotalQuantity, 2);
    store.refreshState();
    fixture.detectChanges();

    let badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge.textContent.trim()).toBe('2');

    // Updated state
    store.overrideSelector(selectCartTotalQuantity, 3);
    store.refreshState();
    fixture.detectChanges();

    badge = fixture.nativeElement.querySelector('.bg-red-500');
    expect(badge.textContent.trim()).toBe('3');
  });
});
