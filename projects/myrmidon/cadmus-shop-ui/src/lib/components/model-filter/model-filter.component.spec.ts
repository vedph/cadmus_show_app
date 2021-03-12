import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelFilterComponent } from './model-filter.component';

describe('CadmusModelFilterComponent', () => {
  let component: ModelFilterComponent;
  let fixture: ComponentFixture<ModelFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
