import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelGraphPageComponent } from './model-graph-page.component';

describe('ModelGraphPageComponent', () => {
  let component: ModelGraphPageComponent;
  let fixture: ComponentFixture<ModelGraphPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelGraphPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelGraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
