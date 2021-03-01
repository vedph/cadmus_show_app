# Index Keywords

## Model

This parts contains a list of index keywords, which are a specialization of the keywords part used to represent entries in a traditional index.

The part is a collection of index keywords. The keyword is the index entry, and conventionally it can represent a hierarchy through dots. For instance, `Athens.history` represents a 2-levels entry, where the first is `Athens` and the second `history`.

Each keyword has:

- `language`: language (usually an [ISO 639 3-letters code](https://en.wikipedia.org/wiki/ISO_639-3)).
- `value`: keyword value.
- `note`: a generic text note.
- `tag`: an optional tag for this keyword, representing any additional general purpose classification.
- `indexId`: an optional index identifier. This can be used when you are building more than a single index, and entries must be distributed among them. For instance, we could group all the entries for person names into a `persons` index.

## Editor

The editor shows a list of keywords. Just click the edit button to edit, or the delete button to remove it.

To add a new keyword, click the `+` circle button; the new keyword will be edited.

Once editing, the keyword tab appears with the editable data for each keyword:

You can either save the changes with the round checkmark button, or discard them with the X red button next to it.
