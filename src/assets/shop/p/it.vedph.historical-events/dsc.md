# Historical Events

## Model

A historical event represents a single event of any type, usually identified by its entity ID and with a place and/or date with its assertion. The event itself can have its assertion too, in order to represent it with different levels of uncertainty, together with the documentary references about the discussion about it.

Also, an event can be linked to a number of related entities, each having an identifier for itself and for its type of relation.

The model is very essential and designed for projection on a semantic graph. For instance, you might want to represent the biography of a person with a list of events, starting from birth and ending with death. The person (the item including the historical events part) would be projected into the graph as a node, and each event will be another node linked to him/her. Related entities in turn could be other nodes indirectly linked to the person via the node event.
