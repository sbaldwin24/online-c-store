import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search query', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(input.nativeElement.value).toBe('');
  });

  it('should show search icon when search query is empty', () => {
    const searchIcon = fixture.debugElement.query(
      By.css('svg path[d*="M21 21l-6-6m2-5a7"]')
    );
    expect(searchIcon).toBeTruthy();
  });

  it('should show clear button when search query is not empty', () => {
    // Set search value
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(
      By.css('button[aria-label="Clear search"]')
    );
    expect(clearButton).toBeTruthy();
  });

  it('should clear search when clear button is clicked', () => {
    // Set search value
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click clear button
    const clearButton = fixture.debugElement.query(
      By.css('button[aria-label="Clear search"]')
    );
    clearButton.nativeElement.click();
    fixture.detectChanges();

    expect(input.nativeElement.value).toBe('');
  });

  it('should emit search event with debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // Type search query
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Wait for debounce
    tick(300);

    expect(searchSpy).toHaveBeenCalledWith('test');
  }));

  it('should not emit search event before debounce time', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // Type search query
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Wait less than debounce time
    tick(200);

    expect(searchSpy).not.toHaveBeenCalled();
  }));

  it('should not emit search event for duplicate queries', fakeAsync(() => {
    const searchSpy = spyOn(component.search, 'emit');
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // Type same search query twice
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);

    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(300);

    expect(searchSpy).toHaveBeenCalledTimes(1);
    expect(searchSpy).toHaveBeenCalledWith('test');
  }));

  it('should have proper accessibility attributes', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));
    expect(input.attributes['aria-label']).toBe('Search products');
    expect(input.attributes['role']).toBe('searchbox');

    const clearButton = fixture.debugElement.query(By.css('button'));
    expect(clearButton?.attributes['aria-label']).toBe('Clear search');
  });

  it('should apply correct styles when search query is empty vs not empty', () => {
    const input = fixture.debugElement.query(By.css('input[type="search"]'));

    // Initially empty
    expect(input.nativeElement.classList.contains('pl-10')).toBeTruthy();

    // Set search value
    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.nativeElement.classList.contains('pl-10')).toBeFalsy();
  });
});
