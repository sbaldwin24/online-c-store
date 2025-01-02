import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../services/cart.services';
import {
  selectCartItems,
  selectCartTotal,
  selectDiscount,
  selectSubtotal
} from '../../store/cart/cart.selectors';
import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let store: MockStore;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cartService: jasmine.SpyObj<CartService>;

  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: 'Test Product',
      price: 99.99,
      quantity: 2
    }
  ];

  const initialState = {
    cart: {
      items: mockCartItems,
      subtotal: 199.98,
      discount: 0,
      total: 199.98
    }
  };

  beforeEach(async () => {
    cartService = jasmine.createSpyObj('CartService', ['clearCart']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectCartItems, value: mockCartItems },
            { selector: selectSubtotal, value: 199.98 },
            { selector: selectDiscount, value: 0 },
            { selector: selectCartTotal, value: 199.98 }
          ]
        }),
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: CartService, useValue: cartService }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.checkoutForm.get('firstName')?.value).toBe('');
    expect(component.checkoutForm.get('lastName')?.value).toBe('');
    expect(component.checkoutForm.get('email')?.value).toBe('');
    expect(component.checkoutForm.get('address')?.value).toBe('');
    expect(component.checkoutForm.get('city')?.value).toBe('');
    expect(component.checkoutForm.get('state')?.value).toBe('');
    expect(component.checkoutForm.get('zipCode')?.value).toBe('');
    expect(component.checkoutForm.get('cardNumber')?.value).toBe('');
    expect(component.checkoutForm.get('expiryDate')?.value).toBe('');
    expect(component.checkoutForm.get('cvv')?.value).toBe('');
    expect(component.checkoutForm.get('nameOnCard')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.checkoutForm;
    expect(form.valid).toBeFalsy();

    // Test each required field
    const controls = [
      'firstName',
      'lastName',
      'email',
      'address',
      'city',
      'state',
      'zipCode',
      'cardNumber',
      'expiryDate',
      'cvv',
      'nameOnCard'
    ];

    controls.forEach(controlName => {
      const control = form.get(controlName);
      expect(control?.errors?.['required']).toBeTruthy();
      expect(control?.valid).toBeFalsy();
    });
  });

  it('should validate email format', () => {
    const emailControl = component.checkoutForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeFalsy();
  });

  it('should validate zip code format', () => {
    const zipControl = component.checkoutForm.get('zipCode');

    zipControl?.setValue('123');
    expect(zipControl?.errors?.['pattern']).toBeTruthy();

    zipControl?.setValue('12345');
    expect(zipControl?.errors).toBeFalsy();

    zipControl?.setValue('12345-6789');
    expect(zipControl?.errors).toBeFalsy();
  });

  it('should validate card number format', () => {
    const cardControl = component.checkoutForm.get('cardNumber');

    cardControl?.setValue('123');
    expect(cardControl?.errors?.['pattern']).toBeTruthy();

    cardControl?.setValue('1234567890123456');
    expect(cardControl?.errors).toBeFalsy();
  });

  it('should validate expiry date format', () => {
    const expiryControl = component.checkoutForm.get('expiryDate');

    expiryControl?.setValue('13/23');
    expect(expiryControl?.errors?.['pattern']).toBeTruthy();

    expiryControl?.setValue('12/23');
    expect(expiryControl?.errors).toBeFalsy();
  });

  it('should validate CVV format', () => {
    const cvvControl = component.checkoutForm.get('cvv');

    cvvControl?.setValue('12');
    expect(cvvControl?.errors?.['pattern']).toBeTruthy();

    cvvControl?.setValue('123');
    expect(cvvControl?.errors).toBeFalsy();

    cvvControl?.setValue('1234');
    expect(cvvControl?.errors).toBeFalsy();
  });

  it('should display cart items and totals', () => {
    store.overrideSelector(selectCartItems, mockCartItems);
    store.overrideSelector(selectSubtotal, 199.98);
    store.overrideSelector(selectDiscount, 0);
    store.overrideSelector(selectCartTotal, 199.98);
    store.refreshState();

    fixture.detectChanges();

    const cartItemsResult = component.cartItems();
    const subtotalResult = component.subtotal();
    const discountResult = component.discount();
    const totalResult = component.cartTotal();

    expect(cartItemsResult).toEqual(mockCartItems);
    expect(subtotalResult).toBe(199.98);
    expect(discountResult).toBe(0);
    expect(totalResult).toBe(199.98);
  });

  it('should update when cart items change', () => {
    const newCartItems = [
      ...mockCartItems,
      {
        id: 2,
        name: 'Another Product',
        price: 49.99,
        quantity: 1
      }
    ];

    store.overrideSelector(selectCartItems, newCartItems);
    store.overrideSelector(selectSubtotal, 249.97);
    store.overrideSelector(selectCartTotal, 249.97);
    store.refreshState();

    fixture.detectChanges();

    expect(component.cartItems()).toEqual(newCartItems);
    expect(component.subtotal()).toBe(249.97);
    expect(component.cartTotal()).toBe(249.97);
  });
});
