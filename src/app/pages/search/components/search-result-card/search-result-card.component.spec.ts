import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../../../models/product.model';
import { SearchResultCardComponent } from './search-result-card.component';

describe('SearchResultCardComponent', () => {
  let component: SearchResultCardComponent;
  let fixture: ComponentFixture<SearchResultCardComponent>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    thumbnail: 'test-image.jpg',
    images: ['image1.jpg'],
    category: 'electronics',
    rating: 4.5,
    stock: 10,
    brand: 'Test Brand',
    discountPercentage: 10
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultCardComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultCardComponent);
    component = fixture.componentInstance;
    component.result = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display product title', () => {
    const titleElement = fixture.nativeElement.querySelector('h3');
    expect(titleElement.textContent.trim()).toBe(mockProduct.title);
  });

  it('should display product description', () => {
    const descriptionElement = fixture.nativeElement.querySelector(
      'p.text-gray-600.text-sm'
    );
    expect(descriptionElement.textContent.trim()).toBe(mockProduct.description);
  });

  it('should display product price', () => {
    const priceElement = fixture.nativeElement.querySelector('.text-blue-600');
    expect(priceElement.textContent.trim()).toContain('$99.99');
  });

  it('should display product image', () => {
    const imageElement = fixture.nativeElement.querySelector('img');
    expect(imageElement).toBeTruthy();
    expect(imageElement.src).toContain(mockProduct.thumbnail);
    expect(imageElement.alt).toBe(mockProduct.title);
  });

  it('should have proper styling classes', () => {
    const card = fixture.nativeElement.querySelector('.bg-white');
    expect(card.classList.contains('rounded-lg')).toBeTrue();
    expect(card.classList.contains('shadow-md')).toBeTrue();
    expect(card.classList.contains('overflow-hidden')).toBeTrue();
    expect(card.classList.contains('hover:shadow-lg')).toBeTrue();
    expect(card.classList.contains('transition-shadow')).toBeTrue();
    expect(card.classList.contains('duration-300')).toBeTrue();
  });

  it('should have proper image styling', () => {
    const image = fixture.nativeElement.querySelector('img');
    expect(image.classList.contains('w-full')).toBeTrue();
    expect(image.classList.contains('h-48')).toBeTrue();
    expect(image.classList.contains('object-cover')).toBeTrue();
  });

  it('should have proper text styling', () => {
    const title = fixture.nativeElement.querySelector('h3');
    expect(title.classList.contains('text-lg')).toBeTrue();
    expect(title.classList.contains('font-semibold')).toBeTrue();
    expect(title.classList.contains('text-gray-800')).toBeTrue();
    expect(title.classList.contains('mb-2')).toBeTrue();
    expect(title.classList.contains('line-clamp-2')).toBeTrue();

    const description = fixture.nativeElement.querySelector('p');
    expect(description.classList.contains('text-gray-600')).toBeTrue();
    expect(description.classList.contains('text-sm')).toBeTrue();
    expect(description.classList.contains('mb-2')).toBeTrue();
    expect(description.classList.contains('line-clamp-2')).toBeTrue();
  });

  it('should throw error if result is not provided', () => {
    component.result = undefined as any;
    expect(() => {
      fixture.detectChanges();
    }).toThrowError();
  });
});
