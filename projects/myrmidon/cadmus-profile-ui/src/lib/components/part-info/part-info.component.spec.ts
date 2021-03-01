import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartInfoComponent } from './part-info.component';

describe('PartInfoComponent', () => {
  let component: PartInfoComponent;
  let fixture: ComponentFixture<PartInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
