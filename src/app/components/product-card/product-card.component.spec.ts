import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from './product-card.component';

// Mock product object
const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'This is a test product description.',
  price: 100,
  discountPercentage: 20,
  thumbnail: 'test-thumbnail.jpg',
  rating: 4.5
};

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule, ProductCardComponent],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct as Product;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product title', () => {
    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toContain(mockProduct.title);
  });

  it('should display the product description', () => {
    const descriptionElement = fixture.debugElement.query(
      By.css('.text-sm.text-gray-500')
    ).nativeElement;
    expect(descriptionElement.textContent).toContain(mockProduct.description);
  });

  it('should display the product price', () => {
    const priceElement = fixture.debugElement.query(
      By.css('.text-lg.font-bold')
    ).nativeElement;
    expect(priceElement.textContent).toContain(`$${mockProduct.price}`);
  });

  it('should display the original price if a discount exists', () => {
    const originalPriceElement = fixture.debugElement.query(
      By.css('.line-through')
    ).nativeElement;
    const expectedOriginalPrice = (
      mockProduct.price /
      (1 - mockProduct.discountPercentage / 100)
    ).toFixed(2);
    expect(originalPriceElement.textContent).toContain(
      `$${expectedOriginalPrice}`
    );
  });

  it('should not display the original price if no discount exists', () => {
    component.product.discountPercentage = 0;
    fixture.detectChanges();
    const originalPriceElement = fixture.debugElement.query(
      By.css('.line-through')
    );
    expect(originalPriceElement).toBeNull();
  });

  it('should display the product rating', () => {
    const ratingElement = fixture.debugElement.query(
      By.css('.text-yellow-500 .mr-1')
    ).nativeElement;
    expect(ratingElement.textContent).toContain(mockProduct.rating);
  });

  it('should display the discount badge when discountPercentage is greater than 0', () => {
    fixture.detectChanges();
    const discountBadge = fixture.debugElement.query(By.css('.bg-red-500'));
    expect(discountBadge).toBeTruthy();
    expect(discountBadge.nativeElement.textContent.trim()).toContain(
      `-${mockProduct.discountPercentage.toFixed(0)}%`
    );
  });

  it('should not display the discount badge when discountPercentage is 0', () => {
    component.product.discountPercentage = 0;
    fixture.detectChanges();
    const discountBadge = fixture.debugElement.query(By.css('.bg-red-500'));
    expect(discountBadge).toBeNull();
  });
});
