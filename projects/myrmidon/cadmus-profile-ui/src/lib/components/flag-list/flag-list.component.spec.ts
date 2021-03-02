import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagListComponent } from './flag-list.component';

describe('FlagDefinitionListComponent', () => {
  let component: FlagListComponent;
  let fixture: ComponentFixture<FlagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
