import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetListPageComponent } from './facet-list-page.component';

describe('FacetListPageComponent', () => {
  let component: FacetListPageComponent;
  let fixture: ComponentFixture<FacetListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
