import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagListCodePageComponent } from './flag-list-code-page.component';

describe('FlagListCodePageComponent', () => {
  let component: FlagListCodePageComponent;
  let fixture: ComponentFixture<FlagListCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagListCodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagListCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
