import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagDefinitionEditorComponent } from './flag-definition-editor.component';

describe('FlagDefinitionEditorComponent', () => {
  let component: FlagDefinitionEditorComponent;
  let fixture: ComponentFixture<FlagDefinitionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagDefinitionEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagDefinitionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
