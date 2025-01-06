import { Route } from '@angular/router';
import { routes } from './app.routes';
import { HomeComponent } from './components/home/home.component';

describe('App Routes', () => {
  it('should have the correct number of routes', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBe(8);
  });

  it('should have home route as the default route', () => {
    const defaultRoute = routes[0];
    expect(defaultRoute).toBeDefined();
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.component).toBe(HomeComponent);
    expect(defaultRoute.title).toBe('Home');
    expect(defaultRoute.loadComponent).toBeUndefined();
  });

  it('should configure search route with lazy loading', async () => {
    const searchRoute = routes[1] as Route;
    expect(searchRoute).toBeDefined();
    expect(searchRoute.path).toBe('search');
    expect(searchRoute.title).toBe('Search Products');
    expect(searchRoute.component).toBeUndefined();

    expect(searchRoute.loadComponent).toBeDefined();
    if (searchRoute.loadComponent) {
      const component = await searchRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should configure category route with parameter and lazy loading', async () => {
    const categoryRoute = routes[2] as Route;
    expect(categoryRoute).toBeDefined();
    expect(categoryRoute.path).toBe('category/:category');
    expect(categoryRoute.title).toBe('Category Products');
    expect(categoryRoute.path).toContain(':category');
    expect(categoryRoute.component).toBeUndefined();

    expect(categoryRoute.loadComponent).toBeDefined();
    if (categoryRoute.loadComponent) {
      const component = await categoryRoute.loadComponent();
      expect(component).toBeDefined();
      expect(component).toBe(HomeComponent);
    }
  });

  it('should configure product detail route with parameter and lazy loading', async () => {
    const productRoute = routes[3] as Route;
    expect(productRoute).toBeDefined();
    expect(productRoute.path).toBe('product/:id');
    expect(productRoute.title).toBe('Product Details');
    expect(productRoute.path).toContain(':id');
    expect(productRoute.component).toBeUndefined();

    expect(productRoute.loadComponent).toBeDefined();
    if (productRoute.loadComponent) {
      const component = await productRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should configure cart route with lazy loading', async () => {
    const cartRoute = routes[4] as Route;
    expect(cartRoute).toBeDefined();
    expect(cartRoute.path).toBe('cart');
    expect(cartRoute.title).toBe('Shopping Cart');
    expect(cartRoute.component).toBeUndefined();

    expect(cartRoute.loadComponent).toBeDefined();
    if (cartRoute.loadComponent) {
      const component = await cartRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should configure checkout route with lazy loading', async () => {
    const checkoutRoute = routes[5] as Route;
    expect(checkoutRoute).toBeDefined();
    expect(checkoutRoute.path).toBe('checkout');
    expect(checkoutRoute.title).toBe('Checkout');
    expect(checkoutRoute.component).toBeUndefined();

    expect(checkoutRoute.loadComponent).toBeDefined();
    if (checkoutRoute.loadComponent) {
      const component = await checkoutRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should configure confirmation route with lazy loading', async () => {
    const confirmationRoute = routes[6] as Route;
    expect(confirmationRoute).toBeDefined();
    expect(confirmationRoute.path).toBe('confirmation');
    expect(confirmationRoute.title).toBe('Order Confirmation');
    expect(confirmationRoute.component).toBeUndefined();

    expect(confirmationRoute.loadComponent).toBeDefined();
    if (confirmationRoute.loadComponent) {
      const component = await confirmationRoute.loadComponent();
      expect(component).toBeDefined();
      expect(typeof component).toBe('function');
    }
  });

  it('should redirect unknown paths to home', () => {
    const wildcardRoute = routes[7];
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute.path).toBe('**');
    expect(wildcardRoute.redirectTo).toBe('');
    expect(wildcardRoute.component).toBeUndefined();
    expect(wildcardRoute.loadComponent).toBeUndefined();
    expect(wildcardRoute.title).toBeUndefined();
  });

  it('should have valid route configurations', () => {
    routes.forEach((route, index) => {
      expect(route).toBeDefined();
      expect(route.path).toBeDefined();
      expect(typeof route.path).toBe('string');

      if (index < routes.length - 1) {
        // All routes except wildcard
        expect(route.title).toBeDefined();
        expect(typeof route.title).toBe('string');

        if (index === 0) {
          // Home route
          expect(route.component).toBeDefined();
          expect(route.loadComponent).toBeUndefined();
        } else {
          // Lazy loaded routes
          expect(route.component).toBeUndefined();
          expect(route.loadComponent).toBeDefined();
          expect(typeof route.loadComponent).toBe('function');
        }
      }
    });
  });

  it('should have unique paths for all routes', () => {
    const paths = routes.map(route => route.path || '');
    const uniquePaths = new Set(paths);
    expect(paths.length).toBe(uniquePaths.size);
    paths.forEach(path => {
      expect(typeof path).toBe('string');
      if (path !== '**' && path !== '') {
        // Skip wildcard and default routes
        expect(path.length).toBeGreaterThan(0);
      }
    });
  });

  it('should properly handle route parameters', () => {
    const routesWithParams = routes.filter(route =>
      (route.path || '').includes(':')
    );
    expect(routesWithParams.length).toBe(2);

    const categoryRoute = routes.find(
      route => route.path === 'category/:category'
    );
    expect(categoryRoute).toBeDefined();
    expect(categoryRoute?.path).toContain(':category');

    const productRoute = routes.find(route => route.path === 'product/:id');
    expect(productRoute).toBeDefined();
    expect(productRoute?.path).toContain(':id');
  });
});
