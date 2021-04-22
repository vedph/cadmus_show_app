import { CsvThesaurusReader } from './csv-thesaurus-reader';

fdescribe('CsvThesarusReader', () => {
  it('should be created', () => {
    expect(new CsvThesaurusReader('')).toBeTruthy();
  });

  it('should read a single thesaurus', () => {
    const reader = new CsvThesaurusReader(
      'languages@en,\n' + 'eng,English\n' + 'ita,Italian\n'
    );
    const thesaurus = reader.read();
    expect(thesaurus).toBeTruthy();
    if (!thesaurus) {
      return;
    }
    expect(thesaurus.id).toBe('languages@en');
    expect(thesaurus.language).toBe('en');
    expect(thesaurus.targetId).toBeFalsy();

    expect(thesaurus.entries.length).toBe(2);
    expect(thesaurus.entries[0].id).toBe('eng');
    expect(thesaurus.entries[0].value).toBe('English');
    expect(thesaurus.entries[1].id).toBe('ita');
    expect(thesaurus.entries[1].value).toBe('Italian');
  });

  it('should read multiple thesauri', () => {
    const reader = new CsvThesaurusReader(
      'languages@en,\n' + 'eng,English\n' + 'ita,Italian\n' +
      'colors@en,\n' + 'r,red\n' + 'g,green\n'
    );

    // languages@en
    let thesaurus = reader.read();
    expect(thesaurus).toBeTruthy();
    if (!thesaurus) {
      return;
    }
    expect(thesaurus.id).toBe('languages@en');
    expect(thesaurus.language).toBe('en');
    expect(thesaurus.targetId).toBeFalsy();
    expect(thesaurus.entries.length).toBe(2);
    expect(thesaurus.entries[0].id).toBe('eng');
    expect(thesaurus.entries[0].value).toBe('English');
    expect(thesaurus.entries[1].id).toBe('ita');
    expect(thesaurus.entries[1].value).toBe('Italian');

    // colors@en
    thesaurus = reader.read();
    expect(thesaurus).toBeTruthy();
    if (!thesaurus) {
      return;
    }
    expect(thesaurus.id).toBe('colors@en');
    expect(thesaurus.language).toBe('en');
    expect(thesaurus.targetId).toBeFalsy();
    expect(thesaurus.entries.length).toBe(2);
    expect(thesaurus.entries[0].id).toBe('r');
    expect(thesaurus.entries[0].value).toBe('red');
    expect(thesaurus.entries[1].id).toBe('g');
    expect(thesaurus.entries[1].value).toBe('green');
  });

  it('should read aliases', () => {
    const reader = new CsvThesaurusReader(
      'biblio-languages@en,=languages\n'
    );
    const thesaurus = reader.read();
    expect(thesaurus).toBeTruthy();
    if (!thesaurus) {
      return;
    }
    expect(thesaurus.id).toBe('biblio-languages@en');
    expect(thesaurus.targetId).toBe('languages');
    expect(thesaurus.entries.length).toBe(0);
  });
});
