import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ProductListComponent } from '../../components/product-list';
import { Product } from '../../models/product.model';
import { loadProducts } from '../../store/product/product.actions';
import {
  selectError,
  selectLoading,
  selectProducts
} from '../../store/product/product.selectors';
import { HomeComponent } from './home.component';

describe('HomeComponent (Page)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let store: MockStore;

  const initialState = {
    products: [],
    loading: false,
    error: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, ProductListComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProducts on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalledWith(loadProducts());
  });

  it('should select products from store', done => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Product 1',
        price: 100,
        description: 'Test description',
        category: 'test',
        discountPercentage: 0,
        rating: 4.5,
        stock: 100,
        brand: 'Test Brand',
        thumbnail: 'test.jpg',
        images: ['test1.jpg', 'test2.jpg']
      },
      {
        id: 2,
        title: 'Product 2',
        price: 200,
        description: 'Test description 2',
        category: 'test',
        discountPercentage: 10,
        rating: 4.0,
        stock: 50,
        brand: 'Test Brand',
        thumbnail: 'test2.jpg',
        images: ['test3.jpg', 'test4.jpg']
      }
    ];

    store.overrideSelector(selectProducts, mockProducts);
    store.refreshState();

    (component as any).products$.subscribe((products: Product[]) => {
      expect(products).toEqual(mockProducts);
      done();
    });
  });

  it('should select loading state from store', done => {
    store.overrideSelector(selectLoading, true);
    store.refreshState();

    (component as any).isLoading$.subscribe((loading: boolean) => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should handle error state from store', done => {
    const consoleSpy = spyOn(console, 'error');
    const mockError = 'Test error';

    store.overrideSelector(selectError, mockError);
    store.refreshState();

    (component as any).error$.subscribe(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error state:', mockError);
      done();
    });
  });

  it('should unsubscribe from error$ on destroy', () => {
    const mockError = 'Test error';
    const consoleSpy = spyOn(console, 'error');

    store.overrideSelector(selectError, mockError);
    fixture.detectChanges();

    component.ngOnInit();
    fixture.destroy();

    store.overrideSelector(selectError, 'New error');
    store.refreshState();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
