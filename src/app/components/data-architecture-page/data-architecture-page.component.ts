import { Component, OnInit } from '@angular/core';
import { HistoricalDate, HistoricalDateModel } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-data-architecture',
  templateUrl: './data-architecture-page.component.html',
  styleUrls: ['./data-architecture-page.component.css'],
})
export class DataArchitecturePageComponent implements OnInit {
  public date: HistoricalDateModel;

  constructor() {
    this.date = HistoricalDate.parse('367/6 BC? -- c. 150 AD {Roman copy}');
  }

  ngOnInit(): void {}
}
