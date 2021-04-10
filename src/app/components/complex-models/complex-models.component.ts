import { Component, OnInit } from '@angular/core';
import { HistoricalDate, HistoricalDateModel } from '@myrmidon/cadmus-core';

@Component({
  selector: 'app-complex-models',
  templateUrl: './complex-models.component.html',
  styleUrls: ['./complex-models.component.css'],
})
export class ComplexModelsComponent implements OnInit {
  public date: HistoricalDateModel;

  constructor() {
    this.date = HistoricalDate.parse('367/6 BC? -- c. 150 AD {Roman copy}');
  }

  ngOnInit(): void {}
}
