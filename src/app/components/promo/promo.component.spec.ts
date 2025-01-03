import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ApplyPromoCode,
  RemovePromoCode,
  UpdateDiscount
} from '../../store/cart/cart.actions';
import {
  selectAppliedPromoCode,
  selectDiscount,
  selectSubtotal
} from '../../store/cart/cart.selectors';
import { PromoComponent } from './promo.component';

describe('PromoComponent', () => {
  let component: PromoComponent;
  let fixture: ComponentFixture<PromoComponent>;
  let store: MockStore;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const initialState = {
    cart: {
      appliedPromoCode: null,
      subtotal: 100,
      discount: 0
    }
  };

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [PromoComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: selectAppliedPromoCode, value: null },
            { selector: selectSubtotal, value: 100 },
            { selector: selectDiscount, value: 0 }
          ]
        }),
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty promo form', () => {
    const input = fixture.debugElement.query(
      By.css('input[formControlName="promoCode"]')
    );
    expect(input.nativeElement.value).toBe('');
  });

  it('should validate required promo code', () => {
    const promoCodeControl = (component as any).promoForm.get('promoCode');

    // Initially empty and invalid
    expect(promoCodeControl?.value).toBe('');
    expect(promoCodeControl?.valid).toBeFalsy();
    expect(promoCodeControl?.errors?.['required']).toBeTruthy();

    // Set valid value
    promoCodeControl?.setValue('TEST');
    fixture.detectChanges();

    expect(promoCodeControl?.valid).toBeTruthy();
    expect(promoCodeControl?.errors).toBeFalsy();
  });

  it('should apply valid promo code and dispatch actions', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const promoCode = 'MERRY-CHRISTMAS';

    // Set promo code value
    (component as any).promoForm.get('promoCode')?.setValue(promoCode);
    fixture.detectChanges();

    // Submit form
    (component as any).promoForm.markAsTouched();
    (component as any).applyPromo();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(
      ApplyPromoCode({ code: promoCode })
    );
    expect(dispatchSpy).toHaveBeenCalledWith(UpdateDiscount({ discount: 10 })); // 10% of 100
    expect(snackBar.open).toHaveBeenCalledWith(
      'Promo code applied successfully!',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should show error for invalid promo code', () => {
    // Set invalid promo code
    (component as any).promoForm.get('promoCode')?.setValue('INVALID-CODE');
    fixture.detectChanges();

    // Submit form
    (component as any).promoForm.markAsTouched();
    (component as any).applyPromo();
    fixture.detectChanges();

    expect(snackBar.open).toHaveBeenCalledWith(
      'Invalid promo code',
      'Close',
      jasmine.any(Object)
    );
  });

  it('should remove promo code', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    (component as any).removePromo();
    expect(dispatchSpy).toHaveBeenCalledWith(RemovePromoCode());
  });

  it('should reset form after applying promo code', () => {
    const promoCode = 'MERRY-CHRISTMAS';
    (component as any).promoForm.get('promoCode')?.setValue(promoCode);
    fixture.detectChanges();

    (component as any).promoForm.markAsTouched();
    (component as any).applyPromo();
    fixture.detectChanges();

    expect((component as any).promoForm.get('promoCode')?.value).toBe('');
  });
});
