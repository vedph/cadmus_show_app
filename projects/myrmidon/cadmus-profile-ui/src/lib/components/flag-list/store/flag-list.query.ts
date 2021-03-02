import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  FlagListState as FlagListState,
  FlagListStore,
} from './flag-list.store';

@Injectable({
  providedIn: 'root',
})
export class FlagListQuery extends QueryEntity<FlagListState> {
  constructor(store: FlagListStore) {
    super(store);
  }
}
