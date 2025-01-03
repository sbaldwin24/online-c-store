import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectProductsByCategory } from '../../store/product/product.selectors';
import {
  getBaseTestEffects,
  getBaseTestImports,
  getBaseTestProviders,
  mockProduct
} from '../../testing/test-utils';
import { ProductCardComponent } from '../product-card/product-card.component';
import { YouMayAlsoLikeComponent } from './you-may-also-like.component';

describe('YouMayAlsoLikeComponent', () => {
  let component: YouMayAlsoLikeComponent;
  let fixture: ComponentFixture<YouMayAlsoLikeComponent>;
  let store: MockStore;

  const mockProducts = [
    mockProduct,
    {
      ...mockProduct,
      id: 2,
      title: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      thumbnail: 'test-image-2.jpg',
      images: ['image2.jpg'],
      rating: 4.0,
      stock: 5,
      discountPercentage: 5
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ...getBaseTestImports(),
        YouMayAlsoLikeComponent,
        ProductCardComponent
      ],
      providers: [
        ...getBaseTestProviders(),
        ...getBaseTestEffects(),
        provideMockStore({
          selectors: [
            {
              selector: selectProductsByCategory('electronics', 1),
              value: mockProducts.filter(p => p.id !== 1)
            }
          ]
        })
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(YouMayAlsoLikeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show anything when category is not provided', () => {
    fixture.detectChanges();
    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(0);
  });

  it('should show related products when category is provided', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(1);
    expect(productCards[0].componentInstance.product).toEqual(mockProducts[1]);
  });

  it('should show heading when products are available', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h3'));
    expect(heading.nativeElement.textContent).toBe('You may also like');
  });

  it('should not show heading when no products are available', () => {
    store.overrideSelector(selectProductsByCategory('electronics', 1), []);
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h3'));
    expect(heading).toBeFalsy();
  });

  it('should use trackByProductId for ngFor', () => {
    const trackByResult = component.trackByProductId(0, mockProducts[0]);
    expect(trackByResult).toBe(mockProducts[0].id);
  });

  it('should properly clean up on destroy', () => {
    const nextSpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should update products when category changes', () => {
    // Initial state
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    let productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(1);

    // Update category
    store.overrideSelector(
      selectProductsByCategory('phones', 1),
      [mockProducts[0]] // Different set of products
    );
    component.category = 'phones';
    fixture.detectChanges();

    productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(1);
    expect(productCards[0].componentInstance.product).toEqual(mockProducts[0]);
  });

  it('should handle empty product list', () => {
    store.overrideSelector(selectProductsByCategory('electronics', 1), []);
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.grid'));
    expect(container).toBeFalsy();
  });

  it('should exclude current product from suggestions', () => {
    component.category = 'electronics';
    component.excludeId = 2;
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    const displayedProducts = productCards.map(
      card => card.componentInstance.product
    );
    expect(
      displayedProducts.some(p => p.id === component.excludeId)
    ).toBeFalse();
  });

  it('should have correct grid layout classes', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const grid = fixture.debugElement.query(By.css('.grid'));
    expect(grid.classes['grid-cols-1']).toBeTrue();
    expect(grid.classes['sm:grid-cols-2']).toBeTrue();
    expect(grid.classes['md:grid-cols-3']).toBeTrue();
    expect(grid.classes['lg:grid-cols-4']).toBeTrue();
  });
});
