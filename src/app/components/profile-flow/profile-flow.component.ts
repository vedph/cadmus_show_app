import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-flow',
  templateUrl: './profile-flow.component.html',
  styleUrls: ['./profile-flow.component.css'],
})
export class ProfileFlowComponent implements OnInit {
  private _steps: boolean[];

  constructor() {
    this._steps = [false, false, false];
  }

  ngOnInit(): void {}

  public onStepperSelectionChange(event: StepperSelectionEvent): void {
    if (this._steps[event.selectedIndex]) {
      return;
    }
    switch (event.selectedIndex) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
    }
  }
}
