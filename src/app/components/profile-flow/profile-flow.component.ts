import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import {
  FacetListQuery,
  FlagListQuery,
  RamThesaurusService,
} from '@myrmidon/cadmus-profile-ui';

@Component({
  selector: 'app-profile-flow',
  templateUrl: './profile-flow.component.html',
  styleUrls: ['./profile-flow.component.css'],
})
export class ProfileFlowComponent implements OnInit {
  private _steps: boolean[];
  public counts: number[];

  constructor(
    private _facetQuery: FacetListQuery,
    private _flagQuery: FlagListQuery,
    private _thesService: RamThesaurusService
  ) {
    this._steps = [false, false, false];
    this.counts = [0, 0, 0];
  }

  ngOnInit(): void {
    this.counts[0] = this._facetQuery.getCount();
  }

  public onStepperSelectionChange(event: StepperSelectionEvent): void {
    if (this._steps[event.selectedIndex]) {
      return;
    }
    switch (event.selectedIndex) {
      case 1:
        this.counts[1] = this._flagQuery.getCount();
        break;
      case 2:
        this.counts[2] = this._thesService.count;
        break;
    }
  }
}
