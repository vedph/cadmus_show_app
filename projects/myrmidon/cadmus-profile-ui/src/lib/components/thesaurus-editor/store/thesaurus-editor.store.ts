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

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'thesaurus-editor' })
export class ThesaurusEditorStore extends EntityStore<
  ThesaurusEditorState,
  ThesaurusNode
> {
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Set all the nodes at once.
   *
   * @param nodes The nodes to set.
   * @param supply True to supply parent and children properties
   * from the nodes' parentId values; false if the nodes already
   * have these properties set.
   */
  public setNodes(nodes: ThesaurusNode[], supply = false): void {
    if (supply) {
      nodes.forEach((node) => {
        if (node.parentId) {
          node.parent = nodes.find((n) => n.id === node.parentId);
          if (node.parent) {
            if (!node.parent.children) {
              node.parent.children = [];
            }
            node.parent.children.push(node);
          }
        }
      });
    }
    this.set(nodes);
  }
}
