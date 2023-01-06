import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FacetListRepository,
  FlagListRepository,
  RamThesaurusService,
} from '@myrmidon/cadmus-profile-ui';

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
    private _facetRepository: FacetListRepository,
    private _flagRepository: FlagListRepository,
    private _thesService: RamThesaurusService,
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
        this.counts[0] = this._facetRepository.getCount();
        break;
      case 1:
        this.counts[1] = this._flagRepository.getCount();
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
}
