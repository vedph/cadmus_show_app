import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FacetListQuery,
  FlagListQuery,
  RamThesaurusService,
} from '@myrmidon/cadmus-profile-ui';
import { TourService } from 'ngx-ui-tour-md-menu';

@Component({
  selector: 'app-profile-flow',
  templateUrl: './profile-flow.component.html',
  styleUrls: ['./profile-flow.component.scss'],
})
export class ProfileFlowComponent implements OnInit {
  private _steps: boolean[];
  public counts: number[];

  public initialIndex: number;

  constructor(
    private _facetQuery: FacetListQuery,
    private _flagQuery: FlagListQuery,
    private _thesService: RamThesaurusService,
    private _tourService: TourService,
    route: ActivatedRoute
  ) {
    this._steps = [false, false, false];
    this.counts = [0, 0, 0];
    this.initialIndex = route.snapshot.queryParams.step
      ? +route.snapshot.queryParams.step - 1
      : 0;
  }

  private setCounts(index: number): void {
    switch (index) {
      case 0:
        this.counts[0] = this._facetQuery.getCount();
        break;
      case 1:
        this.counts[1] = this._flagQuery.getCount();
        break;
      case 2:
        this.counts[2] = this._thesService.count;
        break;
    }
  }

  ngOnInit(): void {
    this.setCounts(this.initialIndex);
  }

  public onStepperSelectionChange(event: StepperSelectionEvent): void {
    if (this._steps[event.selectedIndex]) {
      return;
    }
    this.setCounts(event.selectedIndex);
  }

  public startTour() {
    this._tourService.start();
  }
}
