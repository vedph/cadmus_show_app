import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetListCodePageComponent } from './facet-list-code-page.component';

describe('FacetListCodePageComponent', () => {
  let component: FacetListCodePageComponent;
  let fixture: ComponentFixture<FacetListCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetListCodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetListCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
