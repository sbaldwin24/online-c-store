import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display confirmation heading', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading?.textContent?.trim() || '').toBe(
      'Thank you for your order!'
    );
  });

  it('should display confirmation message', () => {
    const message = fixture.nativeElement.querySelector('p');
    expect(message).toBeTruthy();
    expect(message?.textContent?.trim() || '').toBe(
      'Your order has been confirmed and is being processed.'
    );
  });

  it('should have proper styling classes', () => {
    const section = fixture.nativeElement.querySelector('section');
    expect(section.classList.contains('container')).toBeTrue();
    expect(section.classList.contains('mx-auto')).toBeTrue();
    expect(section.classList.contains('mt-8')).toBeTrue();
    expect(section.classList.contains('text-center')).toBeTrue();

    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading.classList.contains('text-3xl')).toBeTrue();
    expect(heading.classList.contains('font-bold')).toBeTrue();
    expect(heading.classList.contains('mb-4')).toBeTrue();
  });

  it('should render in the correct structure', () => {
    const section = fixture.nativeElement.querySelector('section');
    const heading = section.querySelector('h2');
    const paragraph = section.querySelector('p');

    expect(section).toBeTruthy();
    expect(heading).toBeTruthy();
    expect(paragraph).toBeTruthy();

    const children = Array.from(section.children);
    expect(children[0]).toBe(heading);
    expect(children[1]).toBe(paragraph);
  });
});
