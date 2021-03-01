import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CadmusModel,
  CadmusModelFilter,
  DataPage,
} from 'projects/myrmidon/cadmus-shop-core/src/lib/shop-models';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

/**
 * A file-based Cadmus shop asset service. This stores all the shop
 * assets in a root folder in the app's assets folder.
 */
@Injectable({
  providedIn: 'root',
})
export class CadmusShopAssetService {
  private _partModels: Map<string, CadmusModel> | undefined;
  private _frModels: Map<string, CadmusModel> | undefined;

  constructor(private _http: HttpClient) {}

  public loadText(path: string): Observable<string> {
    return this._http.get<string>('./assets/shop/' + path);
  }

  private loadObject<T>(path: string): Observable<T> {
    return this._http.get<T>('./assets/shop/' + path + '.json');
  }

  private matchFilter(model: CadmusModel, filter: CadmusModelFilter): boolean {
    if (filter.project && model.project !== filter.project) {
      return false;
    }
    if (
      filter.title &&
      !model.title.toLowerCase().includes(filter.title.toLowerCase())
    ) {
      return false;
    }
    if (
      filter.tags?.length &&
      filter.tags.every((t) => !model.tags?.includes(t))
    ) {
      return false;
    }
    return true;
  }

  private getModelPage(
    filter: CadmusModelFilter,
    modelMap: Map<string, CadmusModel>
  ): DataPage<CadmusModel> {
    const skip = (filter.pageNumber - 1) * filter.pageSize;
    const items = [...modelMap.values()]
      .filter((u) => this.matchFilter(u, filter))
      .sort((a, b) => a.id.localeCompare(b.id));
    return {
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      pageCount: 0,
      total: items.length,
      items: filter.pageSize > 0 ? items.slice(skip, filter.pageSize) : items,
    };
  }

  /**
   * Get the specified page of units, or all the units at once
   * if the page size is 0.
   *
   * @param filter The filter.
   * @param fragment True to get fragments, false to get parts.
   */
  getModels(
    filter: CadmusModelFilter,
    fragment: boolean
  ): Observable<DataPage<CadmusModel>> {
    let cachedMap: Map<string, CadmusModel> | undefined;
    let path: string;

    if (fragment) {
      cachedMap = this._frModels;
      path = 'f/index';
    } else {
      cachedMap = this._partModels;
      path = 'p/index';
    }

    // if not cached:
    if (!cachedMap) {
      // load into Observable<CadmusDataUnit[]>
      return this.loadObject<CadmusModel[]>(path).pipe(
        // map to Map<string, CadmusDataUnit>
        map(
          (units: CadmusModel[]) =>
            new Map<string, CadmusModel>(units.map((u) => [u.id, u]))
        ),
        // store map for later use
        tap((m) => {
          if (fragment) {
            this._frModels = m;
          } else {
            this._partModels = m;
          }
        }),
        // map to page
        map((m) => {
          return this.getModelPage(filter, m);
        })
      );
    } else {
      // else just use the cached map
      return of(this.getModelPage(filter, cachedMap));
    }
  }

  /**
   * Get the part or fragment with the specified ID.
   *
   * @param id The part or fragment ID.
   * @param fragment True to get fragments, false to get parts.
   */
  getModel(id: string, fragment: boolean): Observable<CadmusModel | undefined> {
    let cachedMap: Map<string, CadmusModel> | undefined;
    let path: string;

    if (fragment) {
      cachedMap = this._frModels;
      path = 'f/index.json';
    } else {
      cachedMap = this._partModels;
      path = 'p/index.json';
    }

    // if not cached:
    if (!cachedMap) {
      // load into Observable<CadmusDataUnit[]>
      return this.loadObject<CadmusModel[]>(path).pipe(
        // map to Map<string, CadmusDataUnit>
        map(
          (units: CadmusModel[]) =>
            new Map<string, CadmusModel>(units.map((u) => [u.id, u]))
        ),
        // store map for later use
        tap((m) => {
          if (fragment) {
            this._frModels = m;
          } else {
            this._partModels = m;
          }
        }),
        // map to single model
        map((m) => {
          return m.get(id);
        })
      );
    } else {
      // else just use the cached map
      return of(cachedMap.get(id));
    }
  }
}
