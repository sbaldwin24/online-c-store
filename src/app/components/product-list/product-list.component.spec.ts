import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import {
  loadProducts,
  setProductPagination
} from '../../store/product/product.actions';
import {
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let store: MockStore;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
      description: 'Test Description 1',
      price: 99.99,
      thumbnail: 'test-image-1.jpg',
      images: ['image1.jpg'],
      category: 'electronics',
      rating: 4.5,
      stock: 10,
      brand: 'Test Brand',
      discountPercentage: 10
    },
    {
      id: 2,
      title: 'Test Product 2',
      description: 'Test Description 2',
      price: 149.99,
      thumbnail: 'test-image-2.jpg',
      images: ['image2.jpg'],
      category: 'electronics',
      rating: 4.0,
      stock: 5,
      brand: 'Test Brand',
      discountPercentage: 5
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductListComponent,
        ProductCardComponent,
        MatPaginatorModule,
        NoopAnimationsModule
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectPaginatedProducts, value: mockProducts },
            { selector: selectTotalProducts, value: mockProducts.length }
          ]
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProducts on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts());
  });

  it('should render product cards for each product', () => {
    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(mockProducts.length);
  });

  it('should pass correct product to product card', () => {
    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    productCards.forEach((card, index) => {
      expect(card.componentInstance.product).toEqual(mockProducts[index]);
    });
  });

  it('should handle page changes', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 24,
      length: mockProducts.length
    };

    component.onPageChange(pageEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setProductPagination({
        page: pageEvent.pageIndex,
        pageSize: pageEvent.pageSize
      })
    );
  });

  it('should display paginator with correct total', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeTruthy();
    expect(paginator.componentInstance.length).toBe(mockProducts.length);
  });

  it('should have default page size of 12', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator.componentInstance.pageSize).toBe(12);
  });

  it('should have correct page size options', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator.componentInstance.pageSizeOptions).toEqual([12, 24, 36]);
  });

  it('should show first/last page buttons', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator.componentInstance.showFirstLastButtons).toBeTrue();
  });

  it('should have proper accessibility attributes', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator.attributes['aria-label']).toBe('Select page of products');
  });

  it('should update when products input changes', () => {
    const newProducts: Product[] = [mockProducts[0]];
    component.products = newProducts;
    fixture.detectChanges();

    const productCards = fixture.debugElement.queryAll(
      By.directive(ProductCardComponent)
    );
    expect(productCards.length).toBe(1);
    expect(productCards[0].componentInstance.product).toEqual(newProducts[0]);
  });

  it('should handle loading state', () => {
    component.isLoading = true;
    fixture.detectChanges();
    // Add assertions for loading state UI elements if they exist
  });
});
