/**
 * Essential data for an image slide.
 */
export interface ImageSlide {
  id: string;
  label: string;
  tip?: string;
}

/**
 * A Cadmus model (=part or fragment) definition.
 */
export interface CadmusModel {
  fragment?: boolean;
  id: string;
  project: string;
  name: string;
  tip: string;
  tags?: string[];
  // supplied for details:
  code?: string;
  description?: string;
  slides?: ImageSlide[];
}

/**
 * A page of data.
 */
export interface DataPage<T> {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  total: number;
  items: T[];
}

/**
 * A filter for CadmusModel's.
 */
export interface CadmusModelFilter {
  fragment?: boolean;
  project?: string;
  typeId?: string;
  name?: string;
  tags?: string[];
  matchAny?: boolean;
}
