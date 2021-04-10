import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexModelsComponent } from './complex-models.component';

describe('ComplexModelsComponent', () => {
  let component: ComplexModelsComponent;
  let fixture: ComponentFixture<ComplexModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplexModelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
