# Itinera - Poem Ranges in Manuscript

## Model

This model is specific to Itinera, and lists the order in which Petrarch's poems appear in a manuscript. To express this order in a compact yet computable manner, we use a set of alphanumeric ranges, each representing a single poem or a range of poems. The value for each poem starts with a number and may include an alphanumeric suffix after it.

Such values are sorted first by the numeric value of their numeric part, then by the alphanumeric part if any. Values included as edges of a range must be numeric only, because all their intermediate values must be interpolated automatically.

Also, we record the colometries used for these ranges. As the ranges can be grouped by genre (sonetto, canzone, ballata, madrigale, sestina), the UI will allow users to pick a full set of ranges by just selecting a genre. For instance, a user picks "ballata" and this automatically selects poems 11 14 55 59 63 149 324. This is just a way for quickly selecting poems; users can repeat with other groups, or manually add whatever range they prefer.

Genres groups are:

- sonetto: 1-10 12-13 15-21 24-27 31-36 38-49 51 56-58 60-62 64-65 67-69 74-79 81-104 107-118 120 122-124 130-134 136-141
143-148 150-205 208-213 215-236 238 240-263 265-267 269 271-322 326-330 333-358 361-365
- canzone: 23 28-29 37 50 53 70-73 105 119 125-129 135 206-207 264 268 270 323 325 331 359 360 366
- ballata: 11 14 55 59 63 149 324
- madrigale: 52 54 106 121
- sestina: 22 30 66 80 142 214 237 239 332

Each of these poems can have one of these layouts:

- prose
- 1 verse per line
- 2 verses per line
- 3 verses per line

Once the ranges have been selected by picking them from genres and/or entering them, users must specify the layout for each poem.
