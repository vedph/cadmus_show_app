import { inject, InjectionToken } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { ModelListQuery } from './model-list.query';

// create a factory provider for the thesauri paginator
export const MODEL_LIST_PAGINATOR = new InjectionToken('MODEL_LIST_PAGINATOR', {
  providedIn: 'root',
  factory: () => {
    const query = inject(ModelListQuery);
    return new PaginatorPlugin(query).withControls().withRange();
  },
});
