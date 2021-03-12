import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadmusModelFilterComponent } from './cadmus-model-filter.component';

describe('CadmusModelFilterComponent', () => {
  let component: CadmusModelFilterComponent;
  let fixture: ComponentFixture<CadmusModelFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadmusModelFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadmusModelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
