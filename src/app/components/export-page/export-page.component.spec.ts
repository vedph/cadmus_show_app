import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPageComponent } from './export-page.component';

describe('ExportPageComponent', () => {
  let component: ExportPageComponent;
  let fixture: ComponentFixture<ExportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
