import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetListCodeComponent } from './facet-list-code.component';

describe('FacetListCodeComponent', () => {
  let component: FacetListCodeComponent;
  let fixture: ComponentFixture<FacetListCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetListCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetListCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
