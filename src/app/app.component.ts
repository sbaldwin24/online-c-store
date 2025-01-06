import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header />
      <main class="flex-grow container mx-auto px-4 py-8">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class AppComponent {}
