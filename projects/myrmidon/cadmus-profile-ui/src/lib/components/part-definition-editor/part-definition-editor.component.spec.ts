import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartDefinitionEditorComponent } from './part-definition-editor.component';

describe('PartDefinitionEditorComponent', () => {
  let component: PartDefinitionEditorComponent;
  let fixture: ComponentFixture<PartDefinitionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartDefinitionEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartDefinitionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
