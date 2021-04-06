import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShotGalleryComponent } from './shot-gallery.component';

describe('ShotGalleryComponent', () => {
  let component: ShotGalleryComponent;
  let fixture: ComponentFixture<ShotGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShotGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShotGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
