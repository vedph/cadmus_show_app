# Bibliography

## Model

The bibliography part contains any number of bibliographic entries, which may equally represent books, articles, ebooks, web pages, tweets, etc. Each entry has the following properties:

- `typeId`: the type identifier for the entry and its container: e.g. book, journal article, book article, proceedings article, journal review, ebook, site, magazine, newspaper, tweet, TV series, etc. Usually the ID is drawn from a thesaurus.
- `authors`: 1 or more authors, each having a first name, a last name, and an optional role ID. The role IDs are usually drawn from a thesaurus, and mostly used for contributors.
- `title`
- `language`: the ISO 639-3 letters (primary) language code of the bibliographic entry, drawn from a thesaurus.
- `container`: the optional container: a journal, a book, a collection of proceedings, etc.
- `contributors`: 0 or more contributors, with the same properties of the authors. Usually they also have some role specified, e.g. "editor" for the editor of a book collecting a number of articles from different authors, "translator", "organization", etc.
- `edition`: the optional edition number. Default is 0.
- `number`: the optional alphanumeric number (e.g. for a journal).
- `publisher`: the optional publisher name.
- `yearPub`: the optional year of publication. Default is 0.
- `placePub`: the optional place of publication.
- `location`: the location identifier for the bibliographic item, e.g. an URL or a DOI.
- `accessDate`: the optional last access date, typically used for web resources.
- `firstPage`, `lastPage`: the optional pages range. Default values are 0.
- `keywords`: any number of optional keywords assigned to the entry, each with its language and value.
- `note`: an optional free text note.

## Editor

The bibliography editor shows a list of bibliographical entries.

To edit, delete, or move any entry just click the buttons next to it. To add a new entry, click the plus button below the list.

When you edit a new or existing entry, the entry editor is shown.

The entry editor has 3 panes: _general_, _container_, and _keywords_. Once you have done entering the entry's data, click the round buttons at its bottom to either save or discard your changes. This will bring you back to the entries list.

The _general_ pane contains the bibliographic entry type and primary language, its author(s) and title, and an optional note.

You can add as many authors as you want, entering the last name and first name (and optionally the role) of each. Use the buttons next to each author to delete it, add another one below it, or move it up or down.

The _container_ pane is used to specify the bibliographic entry container, like a journal, a book, etc.

Besides its name, the container has any number of contributors with various roles, which are added and edited just like the entry's authors; also, you can specify the number, place and year of publication, location (e.g. a URI or DOI), last access date, and pages range.

Finally, the _keywords_ pane allows you to add as many keywords as you want to the entry. Each keyword has its language and value.

To add a keyword, select its language and type it, then click the plus button. You can then delete or move keywords in the list as desired.
