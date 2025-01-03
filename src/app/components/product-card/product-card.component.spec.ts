import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.services';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    thumbnail: 'test-image.jpg',
    images: ['image1.jpg', 'image2.jpg'],
    category: 'electronics',
    rating: 4.5,
    stock: 10,
    brand: 'Test Brand',
    discountPercentage: 10
  };

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [{ provide: CartService, useValue: cartServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct product input', () => {
    expect(component.product).toEqual(mockProduct);
  });

  it('should add product to cart when addToCart is called', () => {
    component.addToCart();
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should display product details correctly in the template', () => {
    const element = fixture.nativeElement;
    expect(element.querySelector('h3').textContent.trim()).toBe(
      mockProduct.title
    );
    expect(element.querySelector('p').textContent.trim()).toBe(
      mockProduct.description
    );
    expect(element.querySelector('span').textContent.trim()).toBe(
      `\$${mockProduct.price}`
    );
  });

  it('should have correct router link to product details', () => {
    const productLink = fixture.debugElement.query(By.directive(RouterLink));
    const routerLink = productLink.injector.get(RouterLink);
    expect(routerLink.routerLink).toEqual(['/product', mockProduct.id]);
  });

  it('should call addToCart when add to cart button is clicked', () => {
    const addToCartButton = fixture.debugElement.query(By.css('button'));
    addToCartButton.triggerEventHandler('click', { preventDefault: () => {} });
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should throw error if product is not provided', () => {
    expect(() => {
      fixture.detectChanges();
    }).toThrowError();
  });
});
