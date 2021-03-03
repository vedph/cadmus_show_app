import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagListPageComponent } from './flag-list-page.component';

describe('FlagListPageComponent', () => {
  let component: FlagListPageComponent;
  let fixture: ComponentFixture<FlagListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagListPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
