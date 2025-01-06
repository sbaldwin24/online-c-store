import { NgOptimizedImage } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AddItem } from '../../store/cart/cart.actions';
import { loadProduct } from '../../store/product/product.actions';
import { selectProductById } from '../../store/product/product.selectors';
import { getWebPUrl } from '../../utils/image.utils';
import { ProductDetailComponent } from './product.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let store: MockStore;

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    description: 'Test Description',
    price: 100,
    discountPercentage: 10,
    rating: 4.5,
    stock: 50,
    brand: 'Test Brand',
    category: 'Test Category',
    thumbnail: 'test-thumbnail.jpg',
    images: ['image1.jpg', 'image2.jpg']
  };

  const initialState = {
    product: {
      products: [mockProduct],
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
      imports: [NoopAnimationsModule, ProductDetailComponent, NgOptimizedImage],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectProductById(1), mockProduct);
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load product on init', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      fixture = TestBed.createComponent(ProductDetailComponent);
      fixture.detectChanges();

      expect(dispatchSpy).toHaveBeenCalledWith(loadProduct({ id: 1 }));
    });

    it('should handle missing product ID', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, ProductDetailComponent],
        providers: [
          provideMockStore({ initialState }),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                paramMap: {
                  get: () => null
                }
              }
            }
          }
        ]
      });

      const newFixture = TestBed.createComponent(ProductDetailComponent);
      expect(newFixture.componentInstance).toBeTruthy();
    });
  });

  describe('Product Display', () => {
    it('should display loading state initially', () => {
      component['isLoading'].set(true);
      fixture.detectChanges();

      const loadingSpinner = fixture.debugElement.query(
        By.css('.animate-spin')
      );
      expect(loadingSpinner).toBeTruthy();
    });

    it('should display product not found when product is null', () => {
      component['product'].set(null);
      component['isLoading'].set(false);
      fixture.detectChanges();

      const notFoundMessage = fixture.debugElement.query(
        By.css('.text-gray-600')
      );
      expect(notFoundMessage.nativeElement.textContent).toContain(
        'Product not found'
      );
    });

    it('should display product details when product is loaded', () => {
      component['isLoading'].set(false);
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('h1'));
      const description = fixture.debugElement.query(By.css('.text-gray-600'));
      const price = fixture.debugElement.query(By.css('.text-3xl'));

      expect(title.nativeElement.textContent).toBe(mockProduct.title);
      expect(description.nativeElement.textContent).toBe(
        mockProduct.description
      );
      expect(price.nativeElement.textContent).toContain(
        mockProduct.price.toString()
      );
    });
  });

  describe('Image Handling', () => {
    it('should display thumbnail image by default', () => {
      const mainImage = fixture.debugElement.query(By.css('img'));
      expect(mainImage.attributes['src']).toContain(
        getWebPUrl(mockProduct.thumbnail)
      );
    });

    it('should handle empty thumbnail', () => {
      const productWithoutThumbnail = { ...mockProduct, thumbnail: '' };
      component['product'].set(productWithoutThumbnail);
      fixture.detectChanges();

      const mainImage = fixture.debugElement.query(By.css('img'));
      expect(mainImage.attributes['src']).toBe('');
    });

    it('should handle invalid thumbnail URL', () => {
      const productWithInvalidThumbnail = {
        ...mockProduct,
        thumbnail: 'invalid-url'
      };
      component['product'].set(productWithInvalidThumbnail);
      fixture.detectChanges();

      const mainImage = fixture.debugElement.query(By.css('img'));
      expect(mainImage.attributes['src']).toBe('invalid-url');
    });

    it('should handle null product for getSelectedImageUrl', () => {
      component['product'].set(null);
      fixture.detectChanges();
      expect(component['getSelectedImageUrl']()).toBe('');
    });

    it('should handle empty selected image', () => {
      component['selectedImage'].set('');
      fixture.detectChanges();
      expect(component['getSelectedImageUrl']()).toContain(
        getWebPUrl(mockProduct.thumbnail)
      );
    });

    it('should update selected image when thumbnail is clicked', () => {
      const thumbnailButton = fixture.debugElement.query(
        By.css('button[type="button"].aspect-square')
      );
      thumbnailButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component['selectedImage']()).toBe(mockProduct.thumbnail);
    });

    it('should update selected image when product image is clicked', () => {
      const imageButtons = fixture.debugElement.queryAll(
        By.css('button[type="button"].aspect-square')
      );
      // Click the second image button (first product image)
      imageButtons[1].triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(component['selectedImage']()).toBe(mockProduct.images[0]);
    });

    it('should handle empty images array', waitForAsync(async () => {
      const productWithoutImages = { ...mockProduct, images: [] };
      component['product'].set(productWithoutImages);
      fixture.detectChanges();
      await fixture.whenStable();

      const imageButtons = fixture.debugElement.queryAll(
        By.css('button[type="button"].aspect-square')
      );
      // Should only have thumbnail button
      expect(imageButtons.length).toBe(1);
    }));

    it('should handle null images array', waitForAsync(async () => {
      const productWithNullImages = { ...mockProduct, images: null };
      component['product'].set(productWithNullImages);
      fixture.detectChanges();
      await fixture.whenStable();

      const imageButtons = fixture.debugElement.queryAll(
        By.css('button[type="button"].aspect-square')
      );
      // Should only have thumbnail button
      expect(imageButtons.length).toBe(1);
    }));

    it('should handle invalid image URLs in images array', waitForAsync(async () => {
      const productWithInvalidImages = {
        ...mockProduct,
        images: ['invalid-url-1', 'invalid-url-2']
      };
      component['product'].set(productWithInvalidImages);
      fixture.detectChanges();
      await fixture.whenStable();

      const imageButtons = fixture.debugElement.queryAll(
        By.css('button[type="button"].aspect-square')
      );
      expect(imageButtons.length).toBe(3); // thumbnail + 2 invalid images
      const firstImageButton = imageButtons[1].query(By.css('img'));
      expect(firstImageButton.attributes['src']).toBe('invalid-url-1');
    }));
  });

  describe('Price Calculations', () => {
    it('should calculate original price correctly', () => {
      const originalPrice = component['getOriginalPrice']();
      // 100 / (1 - 10/100) = 111.11
      expect(originalPrice).toBe('111.11');
    });

    it('should handle zero discount', () => {
      const productWithoutDiscount = { ...mockProduct, discountPercentage: 0 };
      component['product'].set(productWithoutDiscount);
      fixture.detectChanges();

      const originalPrice = component['getOriginalPrice']();
      expect(originalPrice).toBe('100.00');
    });

    it('should return "0.00" when product is null', () => {
      component['product'].set(null);
      const originalPrice = component['getOriginalPrice']();
      expect(originalPrice).toBe('0.00');
    });
  });

  describe('Cart Functionality', () => {
    it('should add product to cart', waitForAsync(async () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component['product'].set(mockProduct);
      fixture.detectChanges();
      await fixture.whenStable();

      const addToCartButton = fixture.debugElement.query(
        By.css('button[type="button"].bg-blue-600')
      );
      addToCartButton.nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AddItem({ product: mockProduct })
      );
    }));

    it('should not dispatch action when product is null', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component['product'].set(null);
      component['addToCart']();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should disable add to cart button when product is out of stock', waitForAsync(async () => {
      const outOfStockProduct = { ...mockProduct, stock: 0 };
      component['product'].set(outOfStockProduct);
      fixture.detectChanges();
      await fixture.whenStable();

      const addToCartButton = fixture.debugElement.query(
        By.css('button[type="button"].bg-blue-600')
      );
      expect(addToCartButton.nativeElement.disabled).toBeTrue();
      expect(addToCartButton.nativeElement.textContent.trim()).toBe(
        'Out of Stock'
      );
    }));
  });
});
