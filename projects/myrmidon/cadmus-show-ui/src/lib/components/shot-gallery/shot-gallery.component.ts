// import {
//   animate,
//   state,
//   style,
//   transition,
//   trigger,
// } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ImageSlide } from '@myrmidon/cadmus-shop-core';

@Component({
  selector: 'cadmus-shot-gallery',
  templateUrl: './shot-gallery.component.html',
  styleUrls: ['./shot-gallery.component.css'],
  // animations: [
  //   trigger('inOutAnimation', [
  //     transition(':enter', [
  //       style({ transform: 'translateX(100%)', opacity: 0 }),
  //       animate('1s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  //     ]),
  //     transition(':leave', [
  //       style({ transform: 'translateX(100%)', opacity: 1 }),
  //       animate('1s ease-in', style({ transform: 'translateX(0)', opacity: 0 })),
  //     ]),
  //   ]),
  // ],
})
export class ShotGalleryComponent implements OnInit {
  private _slides: ImageSlide[] | undefined;
  private _baseSlideUri: string | undefined;

  public slide: ImageSlide | undefined;
  public slideNr: number;
  public slideUri: string | undefined;

  @Input()
  public get slides(): ImageSlide[] | undefined {
    return this._slides;
  }
  public set slides(value: ImageSlide[] | undefined) {
    this._slides = value;
    this.setCurrentSlide(value?.length ? 1 : 0);
  }

  @Input()
  public get baseSlideUri(): string | undefined {
    return this._baseSlideUri;
  }
  public set baseSlideUri(value: string | undefined) {
    this._baseSlideUri = value;
    this.slideUri = this.buildSlideUri();
  }

  constructor() {
    this.slideNr = 0;
  }

  ngOnInit(): void {
    this.setCurrentSlide(this.slideNr);
  }

  private buildSlideUri(): string | undefined {
    if (!this.slide) {
      return undefined;
    }
    return (this._baseSlideUri || '') + this.slide.id;
  }

  private setCurrentSlide(n: number): void {
    this.slideNr = n;
    if (this._slides) {
      this.slide = this._slides[this.slideNr - 1];
    }
    this.slideUri = this.buildSlideUri();
  }

  public prevShot(): void {
    if (!this._slides || this.slideNr < 2) {
      return;
    }
    this.setCurrentSlide(this.slideNr - 1);
  }

  public nextShot(): void {
    if (!this._slides || this.slideNr === this.slides?.length) {
      return;
    }
    this.setCurrentSlide(this.slideNr + 1);
  }
}
