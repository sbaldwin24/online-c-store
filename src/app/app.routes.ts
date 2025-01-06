import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search/search.page').then(m => m.SearchPageComponent),
    title: 'Search Products'
  },
  {
    path: 'category/:category',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent),
    title: 'Category Products'
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product/product.component').then(
        m => m.ProductDetailComponent
      ),
    title: 'Product Details'
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'Shopping Cart'
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout/checkout.component').then(
        m => m.CheckoutComponent
      ),
    title: 'Checkout'
  },
  {
    path: 'confirmation',
    loadComponent: () =>
      import('./components/confirmation/confirmation.component').then(
        m => m.ConfirmationComponent
      ),
    title: 'Order Confirmation'
  },
  { path: '**', redirectTo: '' }
];
