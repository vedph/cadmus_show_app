# Token-based Text

The token-based text is just a plain text, designed to be the base for a set of metatextual data layers, and using token-based coordinates.

## Model

A *token* here is defined as any sequence of characters separated by space. Thus, users just type the text freely, and the system targets each text portion using two coordinates, one for line (`Y`), and another for token (`X`). For instance, in the picture below the token `Venus` has Y=2 and X=2.

The model for this part simply contains the text, and an optional citation, whose meaning varies according to the document being handled; for instance, in a literary text it might be the start and end citations defining the text span, or a conventional citation system like in CTS; in an epigraphical corpus it might be a conventional citation for the inscription; etc.

## Editor

The editor just contains a text box where the text is freely edited. At the right side of this box, a minimap of the text is shown.

The optional citation can be entered in the small text box at the top.

Also, a number of standard operations can be applied to transform the text when pasting it, so that it best fits this model. In fact, when pasting text you might end up with some artifacts, like extra spaces or single-line texts. These are not ideal for a token-based text, where each portion of it is referenced by its line and token numbers. So, a couple of quick transform operations are available here for normalizing whitespaces or splitting the text into lines at full stops.
