import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render spinner container with proper classes', () => {
    const container = fixture.nativeElement.querySelector('.flex');
    expect(container).toBeTruthy();
    expect(container.classList.contains('justify-center')).toBeTrue();
    expect(container.classList.contains('items-center')).toBeTrue();
  });

  it('should render spinner element with proper classes', () => {
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
    expect(spinner.classList.contains('rounded-full')).toBeTrue();
    expect(spinner.classList.contains('h-8')).toBeTrue();
    expect(spinner.classList.contains('w-8')).toBeTrue();
    expect(spinner.classList.contains('border-b-2')).toBeTrue();
    expect(spinner.classList.contains('border-blue-600')).toBeTrue();
  });

  it('should maintain proper structure', () => {
    const container = fixture.nativeElement.querySelector('.flex');
    const spinner = container.querySelector('.animate-spin');

    expect(container.children.length).toBe(1);
    expect(container.firstElementChild).toBe(spinner);
  });

  it('should have animation class for continuous spinning', () => {
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner.classList.contains('animate-spin')).toBeTrue();
  });
});
