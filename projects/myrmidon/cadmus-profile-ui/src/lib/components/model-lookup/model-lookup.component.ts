import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CadmusShopAssetService } from '@myrmidon/cadmus-shop-asset';
import { CadmusModel } from '@myrmidon/cadmus-shop-core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'cadmus-model-lookup',
  templateUrl: './model-lookup.component.html',
  styleUrls: ['./model-lookup.component.css'],
})
export class ModelLookupComponent {
  /**
   * True to lookup fragments, false to lookup parts.
   */
  @Input()
  public fragment: boolean;
  /**
   * The label to display for the lookup.
   */
  @Input()
  public label: string | undefined;
  /**
   * The max number of models to be returned in a lookup.
   * The default value is 10.
   */
  @Input()
  public limit: number;

  /**
   * Emitted when an item is picked.
   */
  @Output()
  public itemChange: EventEmitter<CadmusModel>;

  public form: FormGroup;
  public lookup: FormControl;
  public items$: Observable<CadmusModel[]>;
  public item: CadmusModel | undefined;

  constructor(
    formBuilder: FormBuilder,
    private _shopService: CadmusShopAssetService
  ) {
    this.fragment = false;
    this.itemChange = new EventEmitter<CadmusModel>();
    // form
    this.lookup = formBuilder.control(null);
    this.form = formBuilder.group({
      lookup: this.lookup,
    });
    this.limit = 10;

    this.items$ = this.lookup.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value: CadmusModel | string) => {
        if (typeof value === 'string') {
          return this._shopService.lookupModels(
            value,
            this.fragment,
            this.limit || 10
          );
        } else {
          return of([value]);
        }
      })
    );
  }

  public getLookupName(item: CadmusModel): string {
    return item?.name;
  }

  public clear(): void {
    this.item = undefined;
    this.lookup.setValue(undefined);
    this.itemChange.emit(undefined);
  }

  public pickItem(item: CadmusModel): void {
    this.item = item;
    this.itemChange.emit(item);
    this.lookup.reset();
  }
}
