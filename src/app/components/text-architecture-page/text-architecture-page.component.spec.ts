import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextArchitecturePageComponent } from './text-architecture-page.component';

describe('TextArchitecturePageComponent', () => {
  let component: TextArchitecturePageComponent;
  let fixture: ComponentFixture<TextArchitecturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextArchitecturePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextArchitecturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
