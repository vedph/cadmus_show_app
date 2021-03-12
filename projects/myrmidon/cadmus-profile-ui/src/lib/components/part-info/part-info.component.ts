import { Component, Input, OnInit } from '@angular/core';
import { CadmusModel } from 'projects/myrmidon/cadmus-shop-core/src/public-api';

@Component({
  selector: 'cadmus-part-info',
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.css'],
})
export class PartInfoComponent implements OnInit {
  private _model: CadmusModel | undefined;

  @Input()
  public get model(): CadmusModel | undefined {
    return this._model;
  }
  public set model(value: CadmusModel | undefined) {
    this._model = value;
  }

  constructor() {}

  ngOnInit(): void {}
}
