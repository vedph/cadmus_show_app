import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetMetadataEditorComponent } from './facet-metadata-editor.component';

describe('FacetMetadataEditorComponent', () => {
  let component: FacetMetadataEditorComponent;
  let fixture: ComponentFixture<FacetMetadataEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetMetadataEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetMetadataEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
