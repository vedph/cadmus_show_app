# Comment Layer

## Model

The comment fragment is a general purpose comment about some portion of the base text. The backend makes no assumption about the format of this comment; the frontend uses a Markdown text to add formatting.

Besides the comment's text, the model also includes an optional tag, which can be used to categorize it; for instance, you might want to tag a comment as related to linguistics, another to history, another to paleography, etc.; or a comment as targeting scholarly audience, another as targeting students, etc.

The tag can belong to a closed list drawn from a thesaurus, or just be free.

## Editor

As for any fragment editor, at the top there is the base text with the target text for the edited fragment highlighted. Also, the title contains the fragment's coordinates (e.g. `1.9` = line 1, token 9).

The Markdown text of the comment can be freely typed in the text box. At the right side of this box there is a minimap for navigating the text; at the bottom, there is a preview of the Markdown text.

Above the comment there is a small box for the optional comment's tag; when a thesaurus is used for a closed set of such tags, the box is a dropdown list rather than a text box.
