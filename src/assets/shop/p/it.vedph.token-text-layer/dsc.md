# Token-based Text Layer

Any token-based or tile-based text layer part uses the same editor to manage fragments and their link to the base text; then, a specialized editor is used when editing or adding fragments.

## Model

A layer part is a part just like any other. The only difference is that:

1. it has a constant model, represented by a simple collection of fragments. This model is just a skeleton which can be embodied by any content, as the model of the fragment is the variable in this part. So, an apparatus layer would be a token text layer part with apparatus fragments; a comments layer would be a token text layer part with comment fragments; etc.

2. conceptually, it depends on another part representing the base text for its layer. The link between a layer and its base text is intentionally designed as a "weak reference", which ensures that:

- the reference exactly defines the span of text it addresses, whatever its extent, from a single character to texts spanning any number of lines.
- no modification is required in the base text part when adding a new layer, whatever its model and the extent of the text it refers to.

## Editor

The editor shows the base text, where each portion connected to a fragment is highlighted. From here, you can add, edit or remove any fragment:

- to _add_ a fragment, select the text portion to be connected with it and click the + button. Note that no part of the text to be connected to a new fragment should already be included into another one, as fragments are not allowed to overlap.
- to _edit_ a fragment, select any portion of the highlighted text (the selection does not need to be precise, as far as it includes at least one highlighted character), and click the pen button.
- to _delete_ a fragment, select it as if you were going to edit it, and click the red trash button (you will be prompted for confirmation).
- to _get the coordinates_ of the current selection, click the `i` button. This is also used in layer hints, when you want to set the target of a movement operation (see below).

At the bottom of any layer editor there always is a layer hints section. This is an experimental tool to aid users in layers reconciliation. This reconciliation should happen any time after the base text has changed and layers were already linked to it. The tool provides a list of hints, one for each fragment in the layer; this way, even when a fragment might be found linked to a no-more existing portion of text it can be displayed here.
