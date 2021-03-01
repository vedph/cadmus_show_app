import { Injectable } from '@angular/core';

/**
 * Environment variables service. This requires EnvServiceProvider.
 * See https://www.jvandemo.com/how-to-use-environment-variables-to-configure-your-angular-application-without-a-rebuild/.
 *
 * To use this service:
 * 1. ensure to add env.js from your app's src folder to the app's assets
 * ("src/env.js" under architect/build/options/assets);
 * 2. add the EnvServiceProvider to your app's providers array;
 * 3. ensure to include env.js in the head of your index.html:
 * <script src="env.js"></script>.
 *
 * The env.js file should include all your environment-dependent settings,
 * e.g.:
 *
 * (function (window) {
 *   window.__env = window.__env || {};
 *   window.__env.apiUrl = 'http://localhost:60200/api/';
 * }(this));
 */
@Injectable({
  providedIn: 'root',
})
export class EnvService {
  private _map: Map<string, string>;

  constructor() {
    this._map = new Map<string, string>();
  }

  /**
   * Get the value for the specified key. If the key is not found,
   * defValue will be returned.
   *
   * @param key The key.
   * @param defValue The default value to return if key is not found.
   */
  public get(key: string, defValue?: string) {
    if (this._map.has(key)) {
      return this._map.get(key);
    }
    return defValue;
  }

  /**
   * Enumerate all the keys in this store.
   */
  public getKeys(): IterableIterator<string> {
    return this._map.keys();
  }

  /**
   * Set a value with the specified key.
   *
   * @param key The key.
   * @param value The value.
   */
  public set(key: string, value: string) {
    this._map.set(key, value);
  }

  /**
   * Delete the value with the specified key, if any.
   *
   * @param key The key.
   */
  public delete(key: string): void {
    this._map.delete(key);
  }

  /**
   * Clear this store.
   */
  public clear(): void {
    this._map.clear();
  }
}
