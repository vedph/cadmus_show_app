import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenGalleryComponent } from './screen-gallery.component';

describe('ScreenGalleryComponent', () => {
  let component: ScreenGalleryComponent;
  let fixture: ComponentFixture<ScreenGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
