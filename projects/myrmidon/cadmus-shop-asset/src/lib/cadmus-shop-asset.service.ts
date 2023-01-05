import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CadmusModel,
  CadmusModelFilter,
  DataPage,
  ImageSlide,
} from '@myrmidon/cadmus-shop-core';
import { forkJoin, Observable, of } from 'rxjs';
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

  /**
   * Load a text from the specified path in the shop.
   *
   * @param path The path (relative to the root folder).
   */
  public loadText(path: string): Observable<string> {
    return this._http.get('./assets/shop/' + path, {
      responseType: 'text',
    });
  }

  /**
   * Load an object from a JSON resource.
   *
   * @param path The path (relative to the root folder).
   * @returns The object parsed from the loaded JSON code.
   */
  public loadObject<T>(path: string): Observable<T> {
    return this._http.get<T>('./assets/shop/' + path + '.json');
  }

  private matchFilter(model: CadmusModel, filter: CadmusModelFilter): boolean {
    if (filter.matchAny) {
      if (filter.project && model.project === filter.project) {
        return true;
      }
      if (
        filter.name &&
        model.name.toLowerCase().includes(filter.name.toLowerCase())
      ) {
        return true;
      }
      if (
        filter.tags?.length &&
        filter.tags.some((t) => model.tags?.includes(t))
      ) {
        return true;
      }
      return false;
    } else {
      if (filter.project && model.project !== filter.project) {
        return false;
      }
      if (
        filter.name &&
        !model.name.toLowerCase().includes(filter.name.toLowerCase())
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
  }

  private getModelPage(
    filter: CadmusModelFilter,
    modelMap: Map<string, CadmusModel>,
    pageNumber: number = 1,
    pageSize: number = 20
  ): DataPage<CadmusModel> {
    const skip = (pageNumber - 1) * pageSize;
    const items = [...modelMap.values()]
      .filter((u) => this.matchFilter(u, filter))
      .sort((a, b) => a.id.localeCompare(b.id));
    return {
      pageNumber: pageNumber,
      pageSize: pageSize,
      pageCount: 0,
      total: items.length,
      items: pageSize > 0 ? items.slice(skip, skip + pageSize) : items,
    };
  }

  /**
   * Get the specified page of models (parts or fragments), or all
   * the models at once if the page size is 0.
   *
   * @param filter The filter.
   */
  public getModels(
    filter: CadmusModelFilter,
    pageNumber = 1,
    pageSize = 20
  ): Observable<DataPage<CadmusModel>> {
    let cachedMap: Map<string, CadmusModel> | undefined;
    let path: string;

    if (filter.fragment) {
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
          if (filter.fragment) {
            this._frModels = m;
          } else {
            this._partModels = m;
          }
        }),
        // map to page
        map((m) => {
          return this.getModelPage(filter, m, pageNumber, pageSize);
        })
      );
    } else {
      // else just use the cached map
      return of(this.getModelPage(filter, cachedMap, pageNumber, pageSize));
    }
  }

  /**
   * Lookup the first N models matching the specified filter.
   *
   * @param filter The title filter.
   * @param fragment True to lookup fragments, false to lookup parts.
   * @param limit The max number of results to return.
   */
  public lookupModels(
    filter: string,
    fragment: boolean,
    limit = 10
  ): Observable<CadmusModel[]> {
    return this.getModels(
      {
        fragment: fragment,
        name: filter,
        typeId: filter,
        matchAny: true,
      },
      1,
      limit
    ).pipe(map((p) => p.items));
  }

  /**
   * Get the part or fragment with the specified ID.
   *
   * @param id The part or fragment ID.
   * @param fragment True to get fragments, false to get parts.
   */
  public getModel(
    id: string,
    fragment: boolean
  ): Observable<CadmusModel | undefined> {
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

  /**
   * Get a model with supplied details (description, code, slides).
   *
   * @param model The model to retrieve details for.
   */
  public getModelDetails(model: CadmusModel): Observable<CadmusModel> {
    // details are retrieved from:
    // -dsc.md
    // -model.txt
    // -slides.json
    const basePath = (model.fragment ? 'f' : 'p') + '/' + model.id + '/';

    return forkJoin({
      d: this.loadText(basePath + 'dsc.md'),
      m: this.loadText(basePath + 'model.txt'),
      s: this.loadObject<ImageSlide[]>(basePath + 'slides'),
    }).pipe(
      map((r) => {
        return {
          ...model,
          description: r.d,
          code: r.m,
          // supply full path relative to shop's root in slides
          slides: r.s.map((slide) => {
            return {
              ...slide,
              id: basePath + 'img/' + slide.id,
            };
          }),
        };
      })
    );
  }
}
