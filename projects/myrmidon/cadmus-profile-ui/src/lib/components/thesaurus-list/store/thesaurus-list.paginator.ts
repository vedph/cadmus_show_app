import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { ThesaurusListQuery } from './thesaurus-list.query';

// create a factory provider for the thesauri paginator
export const THESAURUS_LIST_PAGINATOR = new InjectionToken(
  'THESAURUS_LIST_PAGINATOR',
  {
    providedIn: 'root',
    factory: () => {
      const query = inject(ThesaurusListQuery);
      return new PaginatorPlugin(query).withControls().withRange();
    },
  }
);
