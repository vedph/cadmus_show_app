import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningCountComponent } from './running-count.component';

describe('RunningCountComponent', () => {
  let component: RunningCountComponent;
  let fixture: ComponentFixture<RunningCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunningCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
