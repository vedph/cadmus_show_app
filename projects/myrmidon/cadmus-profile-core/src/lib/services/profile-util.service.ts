import { Injectable } from '@angular/core';

/**
 * A generic group of items under a group key.
 */
export interface KeyedGroup<T> {
  key: string;
  items: T[];
}

/**
 * Utility functions for Cadmus profile data.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileUtilService {
  constructor() {}

  /**
   * Group an array of objects by 1 or more of its string properties.
   *
   * @param arr The array of objects to group.
   * @param keys The keys to be used in grouping objects. It is assumed
   * that such keys are all string properties.
   * @returns An object where each property is a key with value equal
   * to an array of items.
   */
  public groupIntoObject<T>(arr: T[], keys: (keyof T)[]): { [key: string]: T[] } {
    // https://gist.github.com/robmathers/1830ce09695f759bf2c4df15c29dd22d
    return arr.reduce((storage, item) => {
      const compositeKey = keys.map((key) => `${item[key]}`).join(':');
      if (storage[compositeKey]) {
        storage[compositeKey].push(item);
      } else {
        storage[compositeKey] = [item];
      }
      return storage;
    }, {} as { [key: string]: T[] });
  }

  /**
   * Group an array of objects by 1 or more of its string properties,
   * storing the result into an array of KeyedGroup<T>.
   *
   * @param arr The array of objects to group.
   * @param keys The keys to be used in grouping objects. It is assumed
   * that such keys are all string properties.
   * @returns An array of KeyedGroup<T>.
   */
  public groupIntoKeyedGroups<T>(arr: T[], keys: (keyof T)[]): KeyedGroup<T>[] {
    let storage = new Map<string, T[]>();

    storage = arr.reduce((storage, item) => {
      const compositeKey = keys.map((key) => `${item[key]}`).join(':');

      if (storage.has(compositeKey)) {
        storage.set(compositeKey, [...(storage.get(compositeKey) || []), item]);
      } else {
        storage.set(compositeKey, [item]);
      }
      return storage;
    }, storage);

    const groups: KeyedGroup<T>[] = [];
    const sortedKeys: string[] = [...storage.keys()].sort();
    for (let key of sortedKeys) {
      groups.push({
        key: key,
        items: storage.get(key) as T[],
      });
    }
    return groups;
  }
}
