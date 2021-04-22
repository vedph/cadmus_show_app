import { Thesaurus, ThesaurusEntry } from '@myrmidon/cadmus-core';
import { CsvReader, CsvReaderOptions } from './csv-reader';

/**
 * CSV thesaurus reader. This reads any number of thesauri from a CSV text.
 * By convention, the CSV has column 1=ID and column 2=value for each
 * thesaurus entry. Each thesaurus is started by a row having in the ID
 * the thesaurus ID and an empty value.
 * If a thesaurus ID is just an alias, the value starts with an equal sign
 * (e.g. "biblio-languages,=languages") and has no other entries.
 */
export class CsvThesaurusReader {
  private readonly _csvReader: CsvReader;
  private _id?: string;
  private _targetId?: string;
  private _entries: ThesaurusEntry[];
  private _eof: boolean | undefined;

  constructor(text: string, options?: CsvReaderOptions) {
    this._csvReader = new CsvReader(text, options);
    this._entries = [];
  }

  private parseLanguage(id: string): string {
    const i = id.lastIndexOf('@');
    return i > -1 ? id.substr(i + 1) : 'en';
  }

  private getThesaurus(): Thesaurus | null {
    if (!this._id) {
      return null;
    }
    return {
      id: this._id,
      language: this.parseLanguage(this._id),
      targetId: this._targetId,
      entries: this._targetId? undefined : [...this._entries],
    };
  }

  private reset(): void {
    this._id = undefined;
    this._targetId = undefined;
    this._entries.length = 0;
  }

  /**
   * Read the next thesaurus if any.
   *
   * @returns Thesaurus or null if end of CSV text reached.
   */
  public read(): Thesaurus | null {
    if (this._eof) {
      return null;
    }

    while (true) {
      // read the next row
      const row = this._csvReader.read();
      // if no more rows, ret the last thesaurus if any
      if (!row) {
        this._eof = true;
        const last = this.getThesaurus();
        this.reset();
        return last;
      }

      // an empty value starts a new thesaurus
      if (!row[1]) {
        const prev = this.getThesaurus();
        this.reset();
        this._id = row[0];
        // return the previous thesaurus if any
        if (prev) {
          return prev;
        }
      } else if (row[1].startsWith('=') && row[1].length > 1) {
        // a value starting with = is the alias target
        const prev = this.getThesaurus();
        this.reset();
        this._id = row[0];
        this._targetId = row[1].substr(1);
        // return the previous thesaurus if any
        if (prev) {
          return prev;
        }
      } else {
        this._entries.push({
          id: row[0],
          value: row[1],
        });
      }
    }
  }
}
