import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadmusModelListComponent } from './cadmus-model-list.component';

describe('CadmusModelListComponent', () => {
  let component: CadmusModelListComponent;
  let fixture: ComponentFixture<CadmusModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CadmusModelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CadmusModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
