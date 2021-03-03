import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagListCodeComponent } from './flag-list-code.component';

describe('FlagListCodeComponent', () => {
  let component: FlagListCodeComponent;
  let fixture: ComponentFixture<FlagListCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagListCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagListCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
