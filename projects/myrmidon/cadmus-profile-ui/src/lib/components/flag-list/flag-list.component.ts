import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FlagDefinition } from '@myrmidon/cadmus-core';
import { DialogService } from '@myrmidon/cadmus-show-ui';
import { take } from 'rxjs/operators';

@Component({
  selector: 'cadmus-flag-list',
  templateUrl: './flag-list.component.html',
  styleUrls: ['./flag-list.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('1s ease-out', style({ height: '100%', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: 300, opacity: 1 }),
        animate('0.5s ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class FlagListComponent implements OnInit {
  @Input()
  public flags: FlagDefinition[];
  @Output()
  public flagsChange: EventEmitter<FlagDefinition[]>;

  public editedFlag: FlagDefinition | undefined;

  constructor(private _dialogService: DialogService) {
    this.flags = [];
    this.flagsChange = new EventEmitter<FlagDefinition[]>();
  }

  ngOnInit(): void {}

  private getNextId(): number {
    for (let i = 0; i < 32; i++) {
      const testId = 1 << i;
      if (
        this.flags.findIndex(f => testId === f.id) === -1) {
        return testId;
      }
    }
    return 0;
  }

  public addFlag(): void {
    this.editedFlag = {
      id: this.getNextId(),
      label: 'new flag',
      colorKey: '',
      description: ''
    };
  }

  public deleteFlag(index: number): void {
    this._dialogService
      .confirm('Confirmation', 'Delete this flag?')
      .pipe(take(1))
      .subscribe((yes) => {
        if (yes) {
          if (this.editedFlag === this.flags[index]) {
            this.onFlagEditorClose();
          }
          this.flags.splice(index, 1);
        }
      });
  }

  public editFlag(flag: FlagDefinition): void {
    this.editedFlag = flag;
  }

  public onFlagEditorClose(): void {
    this.editedFlag = undefined;
  }

  public onFlagChange(flag: FlagDefinition): void {
    const i = this.flags.findIndex(f => f.id === flag.id);
    if (i === -1) {
      this.flags.push(flag);
    } else {
      this.flags.splice(i, 1, flag);
    }
    this.onFlagEditorClose();
  }

  public save(): void {
    this.flagsChange.emit(this.flags);
  }
}
