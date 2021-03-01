# Tiled Text

The tiled-based text is a plain text with arbitrary tokenization and optional metadata linked to each of its rows and tiles. This is a special type of text, as usually a token-based text is enough.

For instance, tiles can be used to represent non-alphabetic writing systems, or texts where we have the requirement of arbitrary tokenization and/or special metadata to be attached to tokens.

A sample of the latter scenario is when importing TEI-based documents which should be later re-exported while preserving their original segmentation and metadata.

## Model

A tiled text is based on a bidimensional layout, built of rows and tiles. Rows are stacked vertically, and include tiles. Tiles are stacked horizontally.

Each row and tile can have a set of metadata, which are just a set of name=value pairs. Among them, the `text` datum represents its text.

## Editor

The editor shows a set of rows, each with any number of tiles. Each tile is shown with its text, which can be edited in-place by clicking its pen button.

You can append a new tile at the end of a row by clicking the `+` button at its right edge; you can also move any tile by dragging it around. Use the up/down arrows to move the whole row, or the delete button next to them to delete it.

To edit the row's metadata, click the metadata button at the right edge of each row.

When you click a tile, it gets selected, with a blue rectangle around it. You can control the selected tile using the buttons at the bottom, to edit its metadata or remove it.

Finally, you can add a new row by using the `+` button at the bottom.

When editing the metadata of a tile or row, the metadata editor appers. All the metadata are listed, each with its ID and editable value. You can filter them by typing any part of the ID in the data filter.

- to delete a datum, just click the remove button next to it.
- to add a datum, enter its ID and value and click the `+` button.

Once you are done, click the `save data` button to save the metadata, or the red cancel button to discard the changes.
