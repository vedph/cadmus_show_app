/**
 * Options for CsvReader.
 */
export interface CsvReaderOptions {
  fieldSeparator?: string;
  lineSeparator?: string;
  quote?: string;
  trimming?: boolean;
}

const DEFAULT_OPTIONS = {
  fieldSeparator: ',',
  lineSeparator: '\n',
  quote: '"',
  trimming: true
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
 * CSV text reader.
 * Refactored from https://github.com/gregoranders/ts-csv/blob/master/src/index.ts.
 */
export class CsvReader {
  private readonly _text: string;
  private _lastRow = [] as string[];
  private _row = [] as string[];
  private _cell = '';
  private _options = DEFAULT_OPTIONS;
  private _state = { ...CSV_INITAL_STATE };
  private _index = 0;
  private _current = '';
  private _previous = '';

  constructor(text: string, options?: CsvReaderOptions) {
    this._text = text;
    this._options = Object.assign({}, DEFAULT_OPTIONS, options || {});
    this.reset();
  }

  /**
   * Read the next row from the CSV text.
   *
   * @param text - CSV text
   * @returns array of fields, each being an array of strings.
   * @throws Error on parse error
   */
  public read(): readonly string[] | null {
    while (this._index < this._text.length) {
      this._state.appendCell = true;
      this._previous = this._current;
      this._current = this._text[this._index];
      if (this.handleNext()) {
        this._index++;
        return this._lastRow;
      }
      this._index++;
    }

    if (this._row.length > 0) {
      this.addField(this.fieldValue(this._cell), this._row, this._state);
      this.nextRow(this._row, this._state);
      this._row.length = 0;
      return this._lastRow;
    }

    return null;
  }

  private handleNext(): boolean {
    this.handleQuote() ||
      this.handleFieldSeparator() ||
      this.handleLineSeparator();
    return this.processState();
  }

  private handleQuote() {
    if (this._current === this._options.quote) {
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

  private processState(): boolean {
    let end = false;
    if (this._state.appendCell) {
      this._cell += this._current;
    }

    if (this._state.appendField) {
      this.addField(this.fieldValue(this._cell), this._row, this._state);
      this._cell = '';
    }

    if (this._state.appendRow) {
      this.nextRow(this._row, this._state);
      this._row = [] as string[];
      end = true;
    }

    this._state.lineOffset++;
    this._state.fieldOffset++;

    return end;
  }

  private fieldValue(cell: string): string {
    return cell;
  }

  private addField<F extends string, T extends string[]>(
    field: F,
    row: T,
    state: State
  ) {
    row.push(this._options.trimming? field.trim() : field);
    state.field++;
    state.fieldOffset = -1;
    state.appendField = false;
  }

  private nextRow<T extends string[]>(row: T, state: State) {
    this._lastRow = [...row];
    state.field = 0;
    state.line++;
    state.lineOffset = -1;
    state.appendRow = false;
  }

  private reset() {
    this._lastRow = [];
    this._row = [];
    this._cell = '';
    this._state = { ...CSV_INITAL_STATE };
    this._index = 0;
    this._current = '';
    this._previous = '';
  }
}
