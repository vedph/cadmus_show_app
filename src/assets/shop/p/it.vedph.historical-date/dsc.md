# Historical Date

## Model

This part represents a historical date, which is something more complex than a simple number.

A historical date contains a datation with a model including 1 (point `A`) or 2 points (points `A` and `B`). These represent points on a timeline; 2 points represent an interval, where either the initial or the final point can also be unknown (for *terminus ante* and *terminus post*, respectively).

Each point has these properties:

- `value`: the numeric value of the point. Its interpretation depends on other points properties: it may represent a year or a century, or a span between two consecutive Gregorian years.
- `isCentury`: true if `value` is a century number; false if it's a Gregorian year.
- `isSpan`: true if the value is the first year of a pair of two consecutive years. This is used for calendars which span across two Gregorian years, e.g. 776/5 BC.
- `month`: the month number (1-12) or 0.
- `day`: the day number (1-31) or 0.
- `isApproximate`: true if the point is approximate ("about").
- `isDubious`: true if the point is dubious ("perhaphs").
- `hint`: a short textual hint used to better explain or motivate the datation point.

As a sample, consider this datation from SEG 46,1531: `367/366 B.C.? - ca. 150 A.D. (Roman copy)`:

1. point A:
   - `value` = -367
   - `isSpan` = true
   - `isDubious` = true
2. point B:
   - `value` = 150
   - `isApproximate` = true
   - `hint` = "Roman copy"

## Editor

The editor allows entering dates either visually through controls, and textually, by just typing the text representing the date.

Also, you can add any number of short document references at the bottom, related to the datation entered.

In its initial state, the editor just shows the date in its textual form. This includes one or two points, separated by `--`, each with this syntax:

- the value can be prefixed with `c.` = about.
- the value uses digits or Roman numerals for centuries. When using digits and you want to represent a 2-years span, add the second year (eventually also abbreviated) after a slash (e.g. `25/4 BC`).
- the value is followed by `BC` or `AD` for the era, and by `?` for dubious.
- the optional hint is between braces at the end of the text.

For instance, `c.123 AD -- III AD` is a range composed by two points (A and B).

Here you just type a date and press Enter, or click the corresponding button at the edge of the text box.

If you expand the visual editor, you will be able to edit each point visually. Whenever you type in the textual editor, the visual editor is updated accordingly. At the bottom of the visual editor you can switch between single-point and two-points (interval) date. According to this selection, you are presented with one or two tabs for points A and B.

To visually edit a point, just fill the controls as required and when done click the round save button (to discard changes, click the red X button). Whenever you save changes here, the textual representation of the point gets automatically updated.
