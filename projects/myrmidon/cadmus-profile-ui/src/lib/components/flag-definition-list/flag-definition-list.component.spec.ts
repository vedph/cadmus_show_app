import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagDefinitionListComponent } from './flag-definition-list.component';

describe('FlagDefinitionListComponent', () => {
  let component: FlagDefinitionListComponent;
  let fixture: ComponentFixture<FlagDefinitionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagDefinitionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagDefinitionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
