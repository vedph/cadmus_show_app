# Quotations Layer

Quotations layer fragment, used to mark literary quotations in the text.

## Model

The quotations fragment includes any number of quotation entries. Each entry has these properties:

- `author` and `work` (usually IDs drawn from a thesaurus).
- `citation`: the work's passage citation (e.g. `3.24`).
- `citation URI`: an optional URI used to identify the quotation's citation in a reference citational system.
- `variant`: the optional modified quotation text, when the text this layer fragment refers to is different from the quoted text.
- `tag`: tag to group quotations in any meaningful way.
- `note`: an optional note.

## Editor

The quotation editor shows a list of quotations.

To edit, delete, or move any entry just click the buttons next to it. To add a new entry, click the plus button below the list.

When you edit a new or existing entry, the entry editor is shown.

The tag can either be a free text or a selectable option, when the corresponding thesaurus is defined.

The author and work are selected from closed lists when the corresponding thesaurus is defined; otherwise, they are just typed freely. In the former case, the works list gets filled with the works belonging to the selected author.
