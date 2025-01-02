// src/app/components/footer/footer.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-gray-200 p-4 text-center">
      <p>© {{ year }} Online Store. All rights reserved.</p>
    </footer>
  `
})
export class FooterComponent {
  year = new Date().getFullYear();
}
