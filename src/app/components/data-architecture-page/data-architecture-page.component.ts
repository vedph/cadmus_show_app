import { Component, OnInit } from '@angular/core';
import {
  HistoricalDate,
  HistoricalDateModel,
} from '@myrmidon/cadmus-refs-historical-date';

@Component({
  selector: 'app-data-architecture',
  templateUrl: './data-architecture-page.component.html',
  styleUrls: ['./data-architecture-page.component.css'],
})
export class DataArchitecturePageComponent implements OnInit {
  public initialDate: HistoricalDateModel;
  public date?: HistoricalDateModel;

  constructor() {
    this.initialDate = HistoricalDate.parse(
      '367/6 BC? -- c. 150 AD {Roman copy}'
    )!;
  }

  ngOnInit(): void {}

  public onDateChange(date: HistoricalDateModel): void {
    this.date = date;
  }
}
