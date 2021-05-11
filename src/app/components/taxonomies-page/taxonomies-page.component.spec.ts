import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomiesPageComponent } from './taxonomies-page.component';

describe('TaxonomiesPageComponent', () => {
  let component: TaxonomiesPageComponent;
  let fixture: ComponentFixture<TaxonomiesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxonomiesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomiesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
