import { Component, Input, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { ImageSlide } from 'projects/myrmidon/cadmus-shop-core/src/public-api';

@Component({
  selector: 'cadmus-screen-gallery',
  templateUrl: './screen-gallery.component.html',
  styleUrls: ['./screen-gallery.component.css']
})
export class ScreenGalleryComponent implements OnInit {
  private _slides : ImageSlide[];

  @Input()
  public get slides() : ImageSlide[] {
    return this._slides;
  }
  public set slides(value: ImageSlide[]) {
    this._slides = value;
    this.refresh();
  }

  public items: GalleryItem[];

  constructor() {
    this._slides = [];
    this.items = [];
  }

  ngOnInit(): void {
  }

  public onIndexChange(index: any): void {
    // TODO
    console.log(JSON.stringify(index));
  }

  private refresh(): void {
    const root = 'assets/shop/';

    this.items = this._slides.map(s => {
      const extIndex = s.id.lastIndexOf('.');
      const noExtId = s.id.substr(0, extIndex);

      return new ImageItem({
        src: root + s.id,
        thumb: root + noExtId + '-thumb' + s.id.substr(extIndex)
      });
    });
  }
}
