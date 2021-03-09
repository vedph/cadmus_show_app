import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ThesaurusNode } from '../../../services/thesaurus-nodes.service';
import {
  ThesaurusEditorState,
  ThesaurusEditorStore,
} from './thesaurus-editor.store';

@Injectable({
  providedIn: 'root',
})
export class ThesaurusEditorQuery extends QueryEntity<
  ThesaurusEditorState,
  ThesaurusNode
> {
  constructor(store: ThesaurusEditorStore) {
    super(store);
  }
}
