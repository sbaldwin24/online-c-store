import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { AddItem } from '../../store/cart/cart.actions';
import { loadProduct } from '../../store/product/product.actions';
import { selectProductById } from '../../store/product/product.selectors';
import { getWebPUrl } from '../../utils/image.utils';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product.component.html'
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  protected readonly product = signal<Product | null>(null);
  protected readonly isLoading = signal(true);
  protected selectedImage = signal<string | null>(null);

  protected readonly thumbnail = computed(() =>
    this.product()?.thumbnail ? getWebPUrl(this.product()!.thumbnail) : ''
  );

  protected readonly webpImages = computed(
    () => this.product()?.images?.map(img => getWebPUrl(img)) || []
  );

  constructor() {
    // Get the product ID from the route parameter
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId) {
      // Dispatch action to load product
      this.store.dispatch(loadProduct({ id: parseInt(productId, 10) }));

      // Subscribe to product selector
      this.store
        .select(selectProductById(parseInt(productId, 10)))
        .subscribe(product => {
          this.product.set(product || null);
          this.isLoading.set(false);
        });
    }
  }

  protected getOriginalPrice(): string {
    const product = this.product();

    if (!product) return '0.00';

    return (product.price / (1 - product.discountPercentage / 100)).toFixed(2);
  }

  protected getSelectedImageUrl(): string {
    const product = this.product();

    if (!product) return '';
    const currentImage = this.selectedImage() || product.thumbnail;

    return currentImage ? getWebPUrl(currentImage) : '';
  }

  protected selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  protected addToCart(): void {
    const product = this.product();
    if (!product) return;

    this.store.dispatch(AddItem({ product }));
  }
}
