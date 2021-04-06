import { Component, OnInit } from '@angular/core';
import { ImageSlide } from '@myrmidon/cadmus-shop-core';

@Component({
  selector: 'cadmus-shot-gallery',
  templateUrl: './shot-gallery.component.html',
  styleUrls: ['./shot-gallery.component.css']
})
export class ShotGalleryComponent implements OnInit {
  private _slides: ImageSlide[] | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

}
