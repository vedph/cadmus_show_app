import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { ThesaurusNode } from '../../../services/thesaurus-nodes.service';

export interface ThesaurusEditorState
  extends EntityState<ThesaurusNode, string>,
    ActiveState {
  thesId?: string;
  thesTargetId?: string;
}

const INITIAL_STATE = {
  active: null,
};

/**
 * Thesaurus editor store. This contains a page of thesaurus
 * nodes, plus the thesaurus metadata (id and targetId).
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'thesaurus-editor' })
export class ThesaurusEditorStore extends EntityStore<
  ThesaurusEditorState,
  ThesaurusNode
> {
  constructor() {
    super(INITIAL_STATE);
  }
}
