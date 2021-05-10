import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataArchitecturePageComponent } from './data-architecture-page.component';

describe('ComplexModelsComponent', () => {
  let component: DataArchitecturePageComponent;
  let fixture: ComponentFixture<DataArchitecturePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataArchitecturePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataArchitecturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
