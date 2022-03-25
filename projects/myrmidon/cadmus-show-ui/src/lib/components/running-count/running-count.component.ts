import { Component, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { mapTo, scan, startWith, switchMap, takeWhile } from 'rxjs/operators';

// modified from https://github.com/BugSplat-Git/ng-animated-counter/tree/master/projects/ng-animated-counter
export interface RunningCountParams {
  start: number;
  end: number;
  // delay in msecs
  interval: number;
  // optional increment value
  increment?: number;
}

@Component({
  selector: 'cadmus-running-count',
  templateUrl: './running-count.component.html',
  styleUrls: ['./running-count.component.scss'],
})
export class RunningCountComponent implements OnDestroy {
  private _counterSubject$: Subject<number>;
  private _counterSubscription: Subscription | undefined;

  public current: number;

  /**
   * The parameters for this count.
   */
  @Input() set params(value: RunningCountParams) {
    if (this._counterSubscription) {
      this._counterSubscription.unsubscribe();
    }

    this.current = value.start;
    this._counterSubscription = this._counterSubject$
      .pipe(
        switchMap((end) => {
          return timer(0, value.interval).pipe(
            mapTo(this.positiveOrNegative(end, this.current)),
            startWith(this.current),
            scan((acc: number, curr: number) => {
              if (value.increment) {
                return acc + value.increment;
              }
              return acc + curr;
            }),
            takeWhile(this.isApproachingRange(end, this.current))
          );
        })
      )
      .subscribe((val: number) => (this.current = val));

    this._counterSubject$.next(value.end);
  }

  constructor() {
    this._counterSubject$ = new Subject();
    this.current = 0;
  }

  ngOnDestroy(): void {
    if (this._counterSubscription) {
      this._counterSubscription.unsubscribe();
    }
  }

  private positiveOrNegative(endRange: number, currentNumber: number): number {
    return endRange > currentNumber ? 1 : -1;
  }

  private isApproachingRange(
    endRange: number,
    currentNumber: number
  ): (val: number) => boolean {
    return endRange > currentNumber
      ? (val) => val <= endRange
      : (val) => val >= endRange;
  }
}
