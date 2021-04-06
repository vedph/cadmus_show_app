import { Component, Input, OnInit } from '@angular/core';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';

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
