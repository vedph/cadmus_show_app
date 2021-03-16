/**
 * Filter for thesauri.
 */
export interface ThesaurusFilter {
  pageNumber: number;
  pageSize: number;
  idOrValue?: string;
  isAlias?: boolean;
  language?: string;
}

/**
 * A generic signal used by child components to emit
 * events signaling some action to be taken.
 */
export interface ComponentSignal<T> {
  id: string;
  payload?: T;
}
