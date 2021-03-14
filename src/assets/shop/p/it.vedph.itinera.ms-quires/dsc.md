# Manuscript's Quires

## Model

TODO

## Editor

TODO

The editor also allows users to enter collations using formulas like `1-3^4-1`. In this syntax we have any number of tokens separated by whitespace. Each token has the syntax `N-N^N±N {note}` where `-N` and `±N` are optional:

- `N` or `N-N` is the gatherings range (=`startNr` and `endNr`; when only `N` is specified, both are assumed to be equal);
- `^` introduces the sheets count (`sheetCount`);
- `±N` adds an exceptionally missing or additional sheet count (`sheetDelta`).
- `note` is an optional short note. It should not include braces.
