import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCodePageComponent } from './profile-code-page.component';

describe('ProfileCodePageComponent', () => {
  let component: ProfileCodePageComponent;
  let fixture: ComponentFixture<ProfileCodePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileCodePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCodePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
