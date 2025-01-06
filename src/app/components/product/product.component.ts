import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { AddItem } from '../../store/cart/cart.actions';
import { loadProduct } from '../../store/product/product.actions';
import { selectProductById } from '../../store/product/product.selectors';
import { getWebPUrl } from '../../utils/image.utils';
import { YouMayAlsoLikeComponent } from '../you-may-also-like/you-may-also-like.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    RouterLink,
    YouMayAlsoLikeComponent
  ],
  templateUrl: './product.component.html'
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  protected readonly product = signal<Product | null>(null);
  protected readonly isLoading = signal(true);
  protected selectedImage = signal<string | null>(null);
  private imageTransitioning = signal(false);

  protected readonly thumbnail = computed(() =>
    this.product()?.thumbnail ? getWebPUrl(this.product()!.thumbnail) : ''
  );

  protected readonly webpImages = computed(() => {
    const product = this.product();
    if (!product?.images || !Array.isArray(product.images)) return [];
    return product.images.map(img => getWebPUrl(img));
  });

  protected readonly allImages = computed(() => {
    const product = this.product();
    if (!product?.thumbnail) return [];
    return [product.thumbnail, ...(product.images || [])];
  });

  constructor() {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        // Reset state
        this.isLoading.set(true);
        this.selectedImage.set(null);

        // Dispatch action to load product
        this.store.dispatch(loadProduct({ id: parseInt(productId, 10) }));

        // Subscribe to product selector
        this.store
          .select(selectProductById(parseInt(productId, 10)))
          .subscribe(productData => {
            this.product.set(productData || null);
            this.isLoading.set(false);
          });
      }
    });
  }

  protected getOriginalPrice(): string {
    const product = this.product();
    if (!product) return '0.00';
    return (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  }

  protected getSelectedImageUrl(): string {
    const product = this.product();
    if (!product?.thumbnail) return '';

    const currentImage = this.selectedImage();
    if (!currentImage) return getWebPUrl(product.thumbnail);

    return getWebPUrl(currentImage);
  }

  protected selectImage(image: string): void {
    if (!image) return;
    this.imageTransitioning.set(true);
    this.selectedImage.set(getWebPUrl(image));
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product || product.stock === 0) return;

    this.store.dispatch(AddItem({ product }));
  }

  protected hasMultipleImages(): boolean {
    return this.allImages().length > 1;
  }

  protected isImageTransitioning(): boolean {
    return this.imageTransitioning();
  }

  protected onImageLoad(): void {
    this.imageTransitioning.set(false);
  }

  protected nextImage(): void {
    const images = this.allImages();
    if (images.length <= 1) return;

    const currentImage = this.selectedImage();
    const currentIndex = currentImage
      ? images.findIndex(img => getWebPUrl(img) === currentImage)
      : 0;

    this.imageTransitioning.set(true);
    const nextIndex = (currentIndex + 1) % images.length;
    this.selectImage(images[nextIndex]);
  }

  protected previousImage(): void {
    const images = this.allImages();
    if (images.length <= 1) return;

    const currentImage = this.selectedImage();
    const currentIndex = currentImage
      ? images.findIndex(img => getWebPUrl(img) === currentImage)
      : 0;

    this.imageTransitioning.set(true);
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    this.selectImage(images[previousIndex]);
  }
}
