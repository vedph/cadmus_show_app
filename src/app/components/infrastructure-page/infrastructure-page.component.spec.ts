import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructurePageComponent } from './infrastructure-page.component';

describe('InfrastructurePageComponent', () => {
  let component: InfrastructurePageComponent;
  let fixture: ComponentFixture<InfrastructurePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructurePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructurePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
