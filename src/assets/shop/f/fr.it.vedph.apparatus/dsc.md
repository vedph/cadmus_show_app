# Critical Apparatus Layer

## Model

The apparatus fragment can include 1 or more entries. These mostly represent variants, but can also be mere annotations.

Each apparatus fragment has these properties:

- `tag`: an optional arbitrary string representing a categorization of some sort for that fragment, e.g. "margin", "interlinear", etc. This can be overridden by variants `tag`.

- `entries`: 1 or more variants/notes, each with these properties:

  - `type`: an enumerated constant to be chosen among replacement (0), addition before (1), addition after (2), note (3). Please notice that a deletion is just a replacement with zero.
  - `subrange`: the optional token-based sub-range of the base text the entry refers to. This is useful for those cases where 2 or more fragments are linked to a same, wider extent of text, but some of them should be referred to only a part of it. The range is either a single ordinal number (1=first token of the reference text), or two ordinals separated by a dash. As a sample, consider the base text "de nominibus dubiis", where one variant A is represented by the insertion of "incipit" before "de"; and another variant B is the replacement of the whole reference text with "de dubiis nominibus". Now, as we can't overlap two fragments in the same layer, we have a single fragment for the wider extent, covering the whole "de dubiis nominibus" text; in this fragment, entry A has subrange=1, while entry B has no subrange. The alternative treatment would be treating both A and B as replacements with no subrange, but this would be less granular. This usually is the scenario of apparatus entries imported from TEI documents, where tags cannot overlap.
  - `value`: the variant's value. May be zero (empty or null) for deletions. Is optional (because not used) when `type` is note.
  - `tag`: an optional arbitrary string representing a categorization of some sort for that fragment, e.g. "margin", "interlinear", etc. It overrides the fragment's `tag`.
  - `normValue`: an optional normalized form derived from `value`. Normalization details are up to each single project, and the model makes no assumptions about it.
  - `note`: an optional annotation. When `type` is _note_, `value` has no meaning, and this property contains the note's text. Otherwise, this can be an additional note, side to side with the variant's value.
  - `witnesses`: optional array of annotated witnesses. Each has a `value` (e.g. `O`) and an optional note (e.g. `manus altera`).
  - `authors`: optional array of annotated authors. Each has a `value` (e.g. `Verg.` or `Wilamowitz`) and optional `tag` (e.g. `ancient` or `modern`), `location` (e.g. `Kleine Schriften p.12` or `Aen. 1.23`), and `note` (e.g. `exempli gratia`).
  - `isAccepted`: boolean, true if the variant represents the accepted text (=lemma).
  - `groupId`: an optional arbitrary ID to be used for grouping fragments in the layer together.

If required, notes can be Markdown to include some minimal formatting. This should anyway be limited to very basic formatting, e.g. italic and bold.

## Editor

The apparatus fragment editor shows the list of all the entries in the fragment.

Each entry can be edited, moved up or down, or deleted. When there is an entry representing an accepted variant, it is highlighted.

Also, the whole fragment can receive a tag, which can be typed or selected in the control above the list.

Each entry is edited in the entry editor, where:

- you can select the entry type, and fill its controls as needed. Witnesses and authors appear below, with their lists in two expandable regions, each having its title and count.

- each of these lists has buttons to move or delete each item, which can be edited in-place for its value and optional note. The value is either a text box, or a dropdown list if using a thesaurus with a closed list of witnesses or authors.

- once done, you can either save the entry with the round checkmark button, or discard all the changes with the red cancel button next to it.
