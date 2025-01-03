import { NgOptimizedImage } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { CartService } from '../../services/cart.services';
import { loadProduct } from '../../store/product/product.actions';
import { selectProductById } from '../../store/product/product.selectors';
import {
  getBaseTestEffects,
  getBaseTestImports,
  getBaseTestProviders,
  mockProduct
} from '../../testing/test-utils';
import { YouMayAlsoLikeComponent } from '../you-may-also-like/you-may-also-like.component';
import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let store: MockStore;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    cartService = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [
        ...getBaseTestImports(),
        ProductComponent,
        YouMayAlsoLikeComponent,
        NgOptimizedImage
      ],
      providers: [
        ...getBaseTestProviders(),
        ...getBaseTestEffects(),
        provideMockStore(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        { provide: CartService, useValue: cartService }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectProductById(1), mockProduct);

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(ProductComponent);
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(loadProduct({ id: 1 }));
  });

  it('should display product details when product is loaded', () => {
    const element = fixture.nativeElement;

    expect(element.querySelector('h1').textContent).toBe(mockProduct.title);
    expect(element.querySelector('p').textContent).toBe(
      mockProduct.description
    );
    expect(element.querySelector('.text-2xl').textContent).toBe(
      `\$${mockProduct.price}`
    );
    expect(element.querySelector('.text-yellow-400 + span').textContent).toBe(
      mockProduct.rating.toString()
    );
    expect(element.querySelector('.text-gray-700').textContent).toBe(
      `${mockProduct.stock} in stock`
    );
  });

  it('should display discount percentage when available', () => {
    const discountElement = fixture.debugElement.query(
      By.css('.text-green-700')
    );
    expect(discountElement.nativeElement.textContent.trim()).toBe('10% OFF');
  });

  it('should not display discount when discountPercentage is 0', () => {
    const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 };
    store.overrideSelector(selectProductById(1), productWithoutDiscount);
    store.refreshState();
    fixture.detectChanges();

    const discountElement = fixture.debugElement.query(
      By.css('.text-green-700')
    );
    expect(discountElement).toBeFalsy();
  });

  it('should add product to cart when button is clicked', () => {
    const addToCartButton = fixture.debugElement.query(By.css('button'));
    addToCartButton.nativeElement.click();

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should pass correct props to YouMayAlsoLike component', () => {
    const youMayAlsoLike = fixture.debugElement.query(
      By.directive(YouMayAlsoLikeComponent)
    );
    expect(youMayAlsoLike.componentInstance.excludeId).toBe(mockProduct.id);
    expect(youMayAlsoLike.componentInstance.category).toBe(
      mockProduct.category
    );
  });

  it('should show loading state when product is not loaded', () => {
    store.overrideSelector(selectProductById(1), undefined);
    store.refreshState();
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.text-center'));
    expect(loadingElement.nativeElement.textContent).toBe('Loading product...');
  });

  it('should use NgOptimizedImage for product image', () => {
    const image = fixture.debugElement.query(By.css('img'));
    expect(image.attributes['ng-img']).toBeDefined();
    expect(image.attributes['width']).toBe('400');
    expect(image.attributes['height']).toBe('400');
    expect(image.attributes['src']).toContain(mockProduct.thumbnail);
    expect(image.attributes['alt']).toBe(mockProduct.title);
  });

  it('should handle error state when product fails to load', () => {
    store.overrideSelector(selectProductById(1), undefined);
    store.refreshState();
    fixture.detectChanges();

    const loadingElement = fixture.debugElement.query(By.css('.text-center'));
    expect(loadingElement.nativeElement.textContent).toBe('Loading product...');
  });
});
