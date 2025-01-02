import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import {
  loadCategories,
  loadProducts,
  loadProductsByCategory,
  setProductPagination
} from '../../store/product/product.actions';
import {
  selectPaginatedProducts,
  selectTotalProducts
} from '../../store/product/product.selectors';
import { ProductCardComponent } from '../product-card/product-card.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;

  const initialState = {
    products: {
      items: [],
      total: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, MatPaginatorModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({})
          }
        }
      ]
    })
      .overrideComponent(HomeComponent, {
        remove: { imports: [ProductCardComponent] },
        add: { imports: [] }
      })
      .compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and products on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(loadCategories());
    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts());
  });

  it('should load products by category when category param is present', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const category = 'electronics';
    TestBed.inject(ActivatedRoute).params = of({ category });

    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(loadCategories());
    expect(dispatchSpy).toHaveBeenCalledWith(
      loadProductsByCategory({ category })
    );
  });

  it('should update products from store', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test',
        category: 'test',
        discountPercentage: 0,
        rating: 5,
        stock: 10,
        brand: 'Test',
        thumbnail: 'test.jpg',
        images: []
      },
      {
        id: 2,
        title: 'Product 2',
        price: 200,
        description: 'Test',
        category: 'test',
        discountPercentage: 0,
        rating: 5,
        stock: 10,
        brand: 'Test',
        thumbnail: 'test.jpg',
        images: []
      }
    ];

    store.overrideSelector(selectPaginatedProducts, mockProducts);
    store.refreshState();
    fixture.detectChanges();

    expect((component as any).products).toEqual(mockProducts);
  });

  it('should update total products from store', () => {
    const mockTotal = 100;

    store.overrideSelector(selectTotalProducts, mockTotal);
    store.refreshState();
    fixture.detectChanges();

    expect((component as any).totalProducts).toBe(mockTotal);
  });

  it('should handle page changes', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const pageEvent = {
      pageIndex: 1,
      pageSize: 24,
      length: 100
    };

    component.onPageChange(pageEvent);

    expect(dispatchSpy).toHaveBeenCalledWith(
      setProductPagination({
        page: pageEvent.pageIndex,
        pageSize: pageEvent.pageSize
      })
    );
  });

  it('should clean up subscriptions on destroy', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test',
        category: 'test',
        discountPercentage: 0,
        rating: 5,
        stock: 10,
        brand: 'Test',
        thumbnail: 'test.jpg',
        images: []
      }
    ];
    store.overrideSelector(selectPaginatedProducts, mockProducts);

    fixture.detectChanges();
    fixture.destroy();

    // Update store after destroy
    store.overrideSelector(selectPaginatedProducts, []);
    store.refreshState();

    // Products should remain unchanged after destroy
    expect((component as any).products).toEqual(mockProducts);
  });
});
