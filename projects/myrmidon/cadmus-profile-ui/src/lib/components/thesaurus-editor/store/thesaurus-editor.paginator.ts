import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { ThesaurusEditorQuery } from './thesaurus-editor.query';

// create a factory provider for the thesauri paginator
export const THESAURUS_EDITOR_PAGINATOR = new InjectionToken(
  'THESAURUS_EDITOR_PAGINATOR',
  {
    providedIn: 'root',
    factory: () => {
      const query = inject(ThesaurusEditorQuery);
      return new PaginatorPlugin(query).withControls().withRange();
    },
  }
);
