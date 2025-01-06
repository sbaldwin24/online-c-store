import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
      imports: [CheckoutComponent, ReactiveFormsModule, NoopAnimationsModule],
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
      control?.markAsTouched();
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
    zipControl?.markAsTouched();
    expect(zipControl?.errors?.['pattern']).toBeTruthy();

    zipControl?.setValue('12345');
    expect(zipControl?.errors).toBeFalsy();

    zipControl?.setValue('12345-6789');
    expect(zipControl?.errors).toBeFalsy();
  });

  it('should validate card number format', () => {
    const cardControl = component.checkoutForm.get('cardNumber');

    cardControl?.setValue('123');
    cardControl?.markAsTouched();
    expect(cardControl?.errors?.['pattern']).toBeTruthy();

    cardControl?.setValue('1234567890123456');
    expect(cardControl?.errors).toBeFalsy();
  });

  it('should validate expiry date format', () => {
    const expiryControl = component.checkoutForm.get('expiryDate');

    expiryControl?.setValue('13/23');
    expiryControl?.markAsTouched();
    expect(expiryControl?.errors?.['pattern']).toBeTruthy();

    expiryControl?.setValue('12/23');
    expect(expiryControl?.errors).toBeFalsy();
  });

  it('should validate CVV format', () => {
    const cvvControl = component.checkoutForm.get('cvv');

    cvvControl?.setValue('12');
    cvvControl?.markAsTouched();
    expect(cvvControl?.errors?.['pattern']).toBeTruthy();

    cvvControl?.setValue('123');
    expect(cvvControl?.errors).toBeFalsy();

    cvvControl?.setValue('1234');
    expect(cvvControl?.errors).toBeFalsy();
  });

  it('should display cart items and totals', () => {
    fixture.detectChanges();
    const cartItemsSignal = (component as any).cartItems;
    const subtotalSignal = (component as any).subtotal;
    const discountSignal = (component as any).discount;
    const cartTotalSignal = (component as any).cartTotal;

    expect(cartItemsSignal()).toEqual(mockCartItems);
    expect(subtotalSignal()).toBe(199.98);
    expect(discountSignal()).toBe(0);
    expect(cartTotalSignal()).toBe(199.98);
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

    const cartItemsSignal = (component as any).cartItems;
    const subtotalSignal = (component as any).subtotal;
    const cartTotalSignal = (component as any).cartTotal;

    expect(cartItemsSignal()).toEqual(newCartItems);
    expect(subtotalSignal()).toBe(249.97);
    expect(cartTotalSignal()).toBe(249.97);
  });

  it('should format card number on input', () => {
    const cardNumberControl = component.checkoutForm.get('cardNumber');
    cardNumberControl?.setValue('12345678901234567');
    expect(cardNumberControl?.value).toBe('1234567890123456');
  });

  it('should format expiry date on input', () => {
    const expiryDateControl = component.checkoutForm.get('expiryDate');
    expiryDateControl?.setValue('12234');
    expect(expiryDateControl?.value).toBe('12/23');
  });

  it('should format CVV on input', () => {
    const cvvControl = component.checkoutForm.get('cvv');
    cvvControl?.setValue('12345');
    expect(cvvControl?.value).toBe('1234');
  });

  it('should format ZIP code on input', () => {
    const zipCodeControl = component.checkoutForm.get('zipCode');
    zipCodeControl?.setValue('1234567890');
    expect(zipCodeControl?.value).toBe('12345-6789');
  });

  it('should set isSubmitting signal and call cartService.clearCart and router.navigate on successful order', async () => {
    spyOn(component.isSubmitting, 'set').and.callThrough();
    component.checkoutForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      cardNumber: '1234567890123456',
      expiryDate: '12/23',
      cvv: '123',
      nameOnCard: 'John Doe'
    });

    await component.confirmOrder();

    expect(component.isSubmitting()).toBeFalse();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/confirmation']);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Order placed successfully!',
      'Close',
      jasmine.objectContaining({ panelClass: ['success-snackbar'] })
    );
    expect(component.isSubmitting.set).toHaveBeenCalledWith(true);
    expect(component.isSubmitting.set).toHaveBeenCalledWith(false);
  });

  it('should display an error snackbar if form is invalid on confirmOrder', async () => {
    await component.confirmOrder();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Please fill in all required fields correctly.',
      'Close',
      jasmine.objectContaining({ panelClass: ['error-snackbar'] })
    );
  });

  it('should handle error during order placement', async () => {
    spyOn(component.isSubmitting, 'set').and.callThrough();
    const errorMessage = 'Failed to place order';
    cartService.clearCart.and.returnValue(
      Promise.reject(new Error(errorMessage))
    );

    component.checkoutForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      cardNumber: '1234567890123456',
      expiryDate: '12/23',
      cvv: '123',
      nameOnCard: 'John Doe'
    });

    await component.confirmOrder();

    expect(component.isSubmitting()).toBeFalse();
    expect(snackBar.open).toHaveBeenCalledWith(
      'Failed to place order. Please try again.',
      'Close',
      jasmine.objectContaining({ panelClass: ['error-snackbar'] })
    );
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.isSubmitting.set).toHaveBeenCalledWith(true);
    expect(component.isSubmitting.set).toHaveBeenCalledWith(false);
  });

  it('should mark all fields as touched if the form is invalid on submission', async () => {
    const markAsTouchedSpy = spyOn(
      component.checkoutForm,
      'markAsTouched'
    ).and.callThrough();
    await component.confirmOrder();
    expect(markAsTouchedSpy).toHaveBeenCalled();
  });
});
