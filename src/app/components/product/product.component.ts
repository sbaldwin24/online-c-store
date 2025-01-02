import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.services';
import { loadProduct } from '../../store/product/product.actions';
import { selectProductById } from '../../store/product/product.selectors';
import { YouMayAlsoLikeComponent } from '../you-may-also-like/you-may-also-like.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, YouMayAlsoLikeComponent, NgOptimizedImage],
  templateUrl: './product.component.html'
})
export class ProductComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);
  private readonly cartService = inject(CartService);

  readonly product = toSignal(
    this.route.params.pipe(
      switchMap(params => {
        const id = Number(params['id']);
        this.store.dispatch(loadProduct({ id }));
        return this.store.select(selectProductById(id));
      })
    )
  );

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
