import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelLookupComponent } from './model-lookup.component';

describe('ModelLookupComponent', () => {
  let component: ModelLookupComponent;
  let fixture: ComponentFixture<ModelLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
