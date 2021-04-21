import { CsvReader } from './csv-reader';

describe('CsvReader', () => {
  it('should be created', () => {
    expect(new CsvReader('')).toBeTruthy();
  });

  it('should read row A|B|C no LF', () => {
    const reader = new CsvReader('A,B,C');
    // row 1
    let row = reader.read();
    expect(row).toBeTruthy();
    if (!row) {
      return;
    }
    expect(row[0]).toBe('A');
    expect(row[1]).toBe('B');
    expect(row[2]).toBe('C');
    // no more rows
    row = reader.read();
    expect(row).toBeNull();
  });
});
