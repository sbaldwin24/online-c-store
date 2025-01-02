import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.year).toBe(currentYear);
  });

  it('should display copyright message with current year', () => {
    const footerText = fixture.nativeElement.querySelector('p');
    expect(footerText).toBeTruthy();
    expect(footerText?.textContent?.trim() || '').toBe(
      `© ${new Date().getFullYear()} Online Store. All rights reserved.`
    );
  });

  it('should have proper styling classes', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer.classList.contains('bg-gray-200')).toBeTrue();
    expect(footer.classList.contains('p-4')).toBeTrue();
    expect(footer.classList.contains('text-center')).toBeTrue();
  });

  it('should update year when component is created in a different year', () => {
    // Mock the Date object to simulate a different year
    const mockDate = new Date(2025, 0, 1);
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);

    const newFixture = TestBed.createComponent(FooterComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(newComponent.year).toBe(2025);
    const footerText = newFixture.nativeElement.querySelector('p');
    expect(footerText?.textContent?.trim() || '').toBe(
      '© 2025 Online Store. All rights reserved.'
    );

    jasmine.clock().uninstall();
  });

  it('should render in the correct structure', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    const paragraph = footer.querySelector('p');

    expect(footer).toBeTruthy();
    expect(paragraph).toBeTruthy();

    // Verify there's only one child element
    const children = Array.from(footer.children);
    expect(children.length).toBe(1);
    expect(children[0]).toBe(paragraph);
  });
});
