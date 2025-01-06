import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectProductsByCategory } from '../../store/product/product.selectors';
import { getBaseTestImports, mockProduct } from '../../testing/test-utils';
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

  const initialState = {
    product: {
      products: mockProducts,
      categories: [],
      selectedProduct: null,
      loading: false,
      error: null,
      pagination: {
        page: 0,
        pageSize: 12,
        sortBy: 'featured',
        sortOrder: 'desc'
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ...getBaseTestImports(),
        YouMayAlsoLikeComponent,
        ProductCardComponent
      ],
      providers: [
        provideMockStore({
          initialState,
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
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
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

    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent).toContain('You may also like');
  });

  it('should not show heading when no products are available', () => {
    store.overrideSelector(selectProductsByCategory('electronics', 1), []);
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h2'));
    expect(heading).toBeFalsy();
  });

  it('should use trackByProductId for ngFor', () => {
    const product = mockProducts[0];
    const index = 0;
    expect(component.trackByProductId(index, product)).toBe(product.id);
  });

  it('should properly clean up on destroy', () => {
    const unsubscribeSpy = spyOn(
      component['destroy$'],
      'next'
    ).and.callThrough();
    const completeSpy = spyOn(
      component['destroy$'],
      'complete'
    ).and.callThrough();

    fixture.destroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should update products when category changes', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const newProducts = [
      {
        ...mockProduct,
        id: 3,
        title: 'Test Product 3'
      }
    ];

    store.overrideSelector(
      selectProductsByCategory('electronics', 1),
      newProducts
    );
    store.refreshState();
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(1);
    expect(productCards[0].componentInstance.product).toEqual(newProducts[0]);
  });

  it('should exclude current product from suggestions', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    const displayedProducts = productCards.map(
      card => card.componentInstance.product
    );
    expect(displayedProducts.some(p => p.id === 1)).toBeFalsy();
  });

  it('should have correct grid layout classes', () => {
    component.category = 'electronics';
    component.excludeId = 1;
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.grid'));
    expect(
      container.nativeElement.classList.contains('grid-cols-1')
    ).toBeTrue();
    expect(
      container.nativeElement.classList.contains('sm:grid-cols-2')
    ).toBeTrue();
    expect(
      container.nativeElement.classList.contains('lg:grid-cols-4')
    ).toBeTrue();
  });
});
