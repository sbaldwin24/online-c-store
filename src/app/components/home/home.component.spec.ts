import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';
import { Product } from '../../models/product.model';
import {
  loadCategories,
  loadProducts,
  loadProductsByCategory,
  setProductPagination
} from '../../store/product/product.actions';
import {
  selectLoading,
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';
import { CategoriesFilterComponent } from '../categories-filter/categories-filter.component';
import { ProductCardComponent } from '../product-card/product-card.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: jasmine.SpyObj<Store>;
  let route: { params: BehaviorSubject<any> };

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Product 1',
      price: 10.99,
      description: 'Description 1',
      category: 'Category 1',
      thumbnail: 'image1.jpg',
      images: ['image1.jpg'],
      rating: 4.5,
      stock: 100,
      brand: 'Brand 1',
      discountPercentage: 10
    },
    {
      id: 2,
      title: 'Product 2',
      price: 20.99,
      description: 'Description 2',
      category: 'Category 2',
      thumbnail: 'image2.jpg',
      images: ['image2.jpg'],
      rating: 4.0,
      stock: 50,
      brand: 'Brand 2',
      discountPercentage: 5
    }
  ];

  beforeEach(async () => {
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    storeSpy.select.and.callFake((selector: unknown) => {
      if (selector === selectLoading) return of(false);
      if (selector === selectPaginatedProducts) return of(mockProducts);
      if (selector === selectTotalProducts) return of(mockProducts.length);
      return of(undefined);
    });

    route = {
      params: new BehaviorSubject({})
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        HomeComponent,
        CategoriesFilterComponent,
        ProductCardComponent
      ],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: ActivatedRoute, useValue: route }
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component['products']).toEqual(mockProducts);
    expect(component['totalProducts']).toBe(mockProducts.length);
    expect(component['category']).toBeNull();
    expect(component['isLoading']).toBeFalse();
  });

  it('should dispatch loadCategories on init', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadCategories());
  });

  it('should load products when no category is selected', () => {
    expect(store.dispatch).toHaveBeenCalledWith(loadProducts());
  });

  it('should load products by category when category is provided', () => {
    route.params.next({ category: 'electronics' });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(
      loadProductsByCategory({ category: 'electronics' })
    );
  });

  it('should handle page changes', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 24,
      length: mockProducts.length
    };

    component.onPageChange(pageEvent);

    expect(store.dispatch).toHaveBeenCalledWith(
      setProductPagination({
        page: pageEvent.pageIndex,
        pageSize: pageEvent.pageSize
      })
    );
  });

  it('should show loading state', () => {
    const newStore = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    newStore.select.and.callFake((selector: unknown) => {
      if (selector === selectLoading) return of(true);
      if (selector === selectPaginatedProducts) return of([]);
      if (selector === selectTotalProducts) return of(0);
      return of(undefined);
    });

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        HomeComponent,
        CategoriesFilterComponent,
        ProductCardComponent
      ],
      providers: [
        { provide: Store, useValue: newStore },
        { provide: ActivatedRoute, useValue: route }
      ]
    });

    const newFixture = TestBed.createComponent(HomeComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent['isLoading']).toBeTrue();
    const loadingElements =
      newFixture.nativeElement.querySelectorAll('.animate-pulse');
    expect(loadingElements.length).toBe(8);
  });

  it('should show products grid when not loading', () => {
    const productCards =
      fixture.nativeElement.querySelectorAll('app-product-card');
    expect(productCards.length).toBe(mockProducts.length);
  });

  it('should show paginator when products are available', () => {
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not show paginator when no products are available', () => {
    component['products'] = [];
    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('mat-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should update title based on category', () => {
    // Test without category
    const titleWithoutCategory = fixture.nativeElement.querySelector('h2');
    expect(titleWithoutCategory.textContent.trim()).toBe('All Products');

    // Test with category
    route.params.next({ category: 'electronics' });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const titleWithCategory = fixture.nativeElement.querySelector('h2');
    expect(titleWithCategory.textContent.trim()).toBe('Electronics Products');
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    const completeSpy = spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
