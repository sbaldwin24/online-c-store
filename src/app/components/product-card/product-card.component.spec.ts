import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.services';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
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
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
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

  it('should navigate to product details when viewProduct is called', () => {
    component.viewProduct();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/product',
      mockProduct.id
    ]);
  });

  it('should add product to cart when addToCart is called', () => {
    component.addToCart();
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should throw error if product is not provided', () => {
    const testComponent =
      TestBed.createComponent(ProductCardComponent).componentInstance;
    expect(() => {
      testComponent.viewProduct();
    }).toThrow();
  });
});
