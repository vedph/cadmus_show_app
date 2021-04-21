import { Injectable } from '@angular/core';

/**
 * Options for CsvParserService.
 */
export interface CsvParserOptions {
  fieldSeparator?: string;
  lineSeparator?: string;
  quote?: string;
}

const DEFAULT_OPTIONS = {
  fieldSeparator: ',',
  lineSeparator: '\n',
  quote: '"',
};

interface State {
  appendCell: boolean;
  appendField: boolean;
  appendRow: boolean;
  field: number;
  fieldOffset: number;
  line: number;
  lineOffset: number;
  quoted: boolean;
}

const CSV_INITAL_STATE = {
  field: 0,
  fieldOffset: 0,
  line: 0,
  lineOffset: 0,
  quoted: false,
  appendCell: false,
  appendField: false,
  appendRow: false,
} as State;

class ParseError extends Error {
  public constructor(line: number, column: number) {
    super(`Invalid CSV at ${line}:${column}`);
  }
}

/**
 * Simple CSV parser. Derived from
 * https://github.com/gregoranders/ts-csv/blob/master/src/index.ts.
 * Usage: eventually configure with the desired options, then use
 * parse to get an array of fields (=string arrays).
 */
@Injectable({
  providedIn: 'root',
})
export class CsvParserService {
  private _rows = [] as string[][];
  private _row = [] as string[];
  private _cell = '';
  private _options = DEFAULT_OPTIONS;
  private _state = { ...CSV_INITAL_STATE };
  private _index = 0;
  private _current = '';
  private _previous = '';
  private _quoteState = { ...CSV_INITAL_STATE };

  constructor() {
    this._options = Object.assign({}, DEFAULT_OPTIONS);
  }

  /**
   * Configure this service.
   *
   * @param options The options.
   */
  public configure(options: CsvParserOptions): void {
    this._options = Object.assign({}, DEFAULT_OPTIONS, options);
  }

  /**
   * Parse CSV text.
   *
   * @param text - CSV text
   * @returns array of fields, each being an array of strings.
   * @throws Error on parse error
   */
  public parse(text: string): readonly string[][] {
    this.reset();

    for (this._index = 0; this._index < text.length; this._index++) {
      this._state.appendCell = true;
      this._previous = this._current;
      this._current = text[this._index];
      this.handleNext();
    }

    if (this._row.length > 0) {
      this.addField(this.fieldValue(this._cell), this._row, this._state);
      this.addRow(this._row, this._rows, this._state);
    }

    if (this._state.quoted) {
      throw new ParseError(this._quoteState.line, this._quoteState.lineOffset);
    }

    this.makeImmutable();

    return this._rows;
  }

  /**
   * Returns rows.
   *
   * @returns array of fields, each being an array of strings.
   */
  public get rows(): readonly string[][] {
    return this._rows;
  }

  /**
   * Returns rows as an array of objects using the first row as property
   * name provider.
   *
   * @returns an array of objects.
   */
  public getObject<T>(): readonly T[] {
    if (this.rows.length > 0) {
      const keys = this.rows[0].filter(
        (field) => typeof field === 'string'
      ) as string[];

      return Object.freeze(
        this.rows
          .filter((row, idx) => row && idx > 0)
          .map((row) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const object = {} as any;
            keys.forEach((key, keyIdx) => {
              object[key] = row[keyIdx];
            });

            return Object.freeze(object);
          })
      );
    }

    return Object.freeze([]);
  }

  private handleNext() {
    this.handleQuote() ||
      this.handleFieldSeparator() ||
      this.handleLineSeparator();
    this.processState();
  }

  private handleQuote() {
    if (this._current === this._options.quote) {
      this._quoteState = { ...this._state };
      if (this._index && this._previous !== '\\') {
        this.handleQuoteNotEscaped();
      } else {
        this.handleQuoteEscaped();
      }
      return true;
    }
    return false;
  }

  private handleQuoteEscaped() {
    this._cell = this._cell.slice(0, Math.max(0, this._cell.length - 1));
  }

  private handleQuoteNotEscaped() {
    if (this._cell.length === 0 || this._state.quoted) {
      this._state.quoted = !this._state.quoted;
    } else {
      throw new ParseError(this._state.line, this._state.lineOffset);
    }
    this._state.appendCell = false;
  }

  private handleFieldSeparator() {
    if (this._current === this._options.fieldSeparator) {
      if (!this._state.quoted) {
        this._state.appendCell = false;
        this._state.appendField = true;
      }
      return true;
    }
    return false;
  }

  private handleLineSeparator() {
    if (this._current === this._options.lineSeparator) {
      if (!this._state.quoted) {
        this._state.appendCell = false;
        this._state.appendField = true;
        this._state.appendRow = true;
      }
      return true;
    }
    return false;
  }

  private processState() {
    if (this._state.appendCell) {
      this._cell += this._current;
    }

    if (this._state.appendField) {
      this.addField(this.fieldValue(this._cell), this._row, this._state);
      this._cell = '';
    }

    if (this._state.appendRow) {
      this.addRow(this._row, this._rows, this._state);
      this._row = [] as string[];
    }

    this._state.lineOffset++;
    this._state.fieldOffset++;
  }

  private fieldValue(cell: string): string {
    return cell;
  }

  private addField<F extends string, T extends string[]>(
    field: F,
    row: T,
    state: State
  ) {
    row.push(field);
    state.field++;
    state.fieldOffset = -1;
    state.appendField = false;
  }

  private addRow<T extends string[]>(row: T, rows: T[], state: State) {
    rows.push(row);
    state.field = 0;
    state.line++;
    state.lineOffset = -1;
    state.appendRow = false;
  }

  private makeImmutable() {
    this.rows.forEach((row) => {
      row.forEach((value) => Object.freeze(value));
      Object.freeze(row);
    });
    Object.freeze(this._rows);
  }

  private reset() {
    this._rows = [];
    this._row = [];
    this._cell = '';
    this._state = { ...CSV_INITAL_STATE };
    this._index = 0;
    this._current = '';
    this._previous = '';
    this._quoteState = { ...CSV_INITAL_STATE };
  }
}
