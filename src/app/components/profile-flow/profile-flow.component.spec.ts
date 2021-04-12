import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFlowComponent } from './profile-flow.component';

describe('ProfileFlowComponent', () => {
  let component: ProfileFlowComponent;
  let fixture: ComponentFixture<ProfileFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
