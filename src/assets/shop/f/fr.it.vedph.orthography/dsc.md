# Orthography Layer

## Model

The orthography fragment contains the *standard* orthography corresponding to the base text form, and additionally a set of operations which describe the transformation from the original to the standard form.

These *operations* are used to provide further details on the mapping between the two forms, together with the information about the underlying linguistic phenomena.

Each transform operation is expressed in a mini-syntax with a form like `"A"@NxC="B"`, where:

- `"A"` is the original text.
- `@NxC` is the coordinate of the input text: `N`=character ID (normally its ordinal number) and `C`=characters count.
- `=` is the operator; here it is an equal operator, which given count=1 represents a replacement.
- `"B"` is the new text.

Thus, for instance `"b"@1x1="v"` means that the letter `b` in `bixit` gets replaced by the letter `v` (whence the standard `vixit` orthography).

Each character in the original text form gets an ID, which is just its ordinal number. For instance, in `bixit` `b`=1, `i`=2, etc.

It should be remarked that, even if this ID is generated from the position of each character in the original form, the ID has no intrisic positional meaning; it is just a label, which uniquely identifies the character.

For instance, if we later insert a character, e.g. `e` before `bixit` whence `ebixit`, the newly inserted character would rather be identified by the next free numeric value in the natural order, e.g. 6 (as `bixit` counts 5 characters); yet, it would appear as first. At the misspelling level usually we are not required to assign new IDs, as most of the operations refer to the initial form; yet, this is how we would refer to newly added character(s).

The operators are:

- *delete*: `"A"@NxN=` where `"A"` is optional: e.g. `@2x1=`, with an A-range (whose length is always greater than 0), without a B-value (which by definition is zero). The A-value can optionally be provided; it is recommended to provide it, for a better readability of the operation outside of its context.
- *insert*: `@NxN="B"`: e.g. `@2x0="b"`, with an A-range (whose length is always 0) with a B-value. The A-value is zero by definition.
- *replace*: `"A"@NxN="B"`, where `"A"` is optional: e.g. `"b"@1x1="v"`, with an A-range (whose length is always greater than 0) and a B-value. The A-value is optional but recommended.
- *move*: `"A"@NxN>@N` where `"A"` is optional, e.g. `"r"@2x1>@4`, with an A-range (whose length is always greater than 0) and a B-range (whose length is always 0). The A-value is optional but recommended.
- *swap*: `"A"@NxN~"B"@NxN` where both `"A"` and `"B"` are optional, e.g. `"r"@2x1~"s"@4x1`, with an A-range (whose length is always greater than 0) and a B-range (whose length is always greater than 0). The A and B values are optional but recommended.

Further, all the operations may optionally have a classification tag (in `[]`), which is useful also for indexing purposes, and a short note (in `{}`).

Tto account for the underlying linguistic phenomenon, often user intervention is required. In the case of `BIXIT` for `VIXIT`, we just have a replacement accounting for the hypercorrection due to the spirantization of `B`. Thus:

```txt
BIXIT -> VIXIT
12345

"b"@1x1="v"
```

This operation can automatically be provided by diffing.

Yet, consider another case, like `PENA` for `POENA`. Here, we want to best represent the monophthongization; so we do not describe the operation in term of an insert (which is what would come out from diffing these two forms); but rather in terms of a replace. This better encodes the linguistic phenomenon by which `OE` gets written as `E`:

```txt
PENA -> POENA
1234

"e"@2x1="oe"
```

Again, consider `ACCERSO` for `ARCESSO`. Here, 3 operations are joined together. The starting point is the mobility of liquids, by which `R` is moved earlier in the word. This triggers the degemination of `C`, and the complementary gemination of `S`, which preserves the prosodical profile of the word after the initial consonantic change. All this evolution is summarized by these 3 operations, which in turn underly the non-standard orthography registered in the layer:

```txt
ACCERSO -> ARCESSO
1234567

"r"@5x1>@2x0
"cc"@2x2="c"
"s"@6x1="ss"
```

## Editor

In its simplest form, the editor allows you to enter the standard orthography next to the original form.

You can then add more granular data by specifying the operations by which the original form can be transformed into the standard one. This should be done in such a way that the underlying linguistic phenomena are best reflected, so it usually requires human intervention.

Yet, in many cases you can just let the editor compare the two forms, and automatically list the transform operations required to get from the original form to the standard one. This can be either used as a starting point for manual editing, or just be accepted as it is. To do this, just enter the standard orthography and click the square `+` button.

To manually add an operation, click the round `+` button and type it.

If you prefer to visually edit an operation, rather than using this syntax, you can click the pen button next to each operation to expand it in the `Visual` editor; then, fill the controls as needed and click the round checkmark button to save, or the red cancel button next to it to discard changes.
