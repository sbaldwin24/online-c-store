import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  protected getOriginalPrice(): string {
    return (
      this.product.price /
      (1 - this.product.discountPercentage / 100)
    ).toFixed(2);
  }
}
