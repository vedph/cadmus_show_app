# Proper Names

## Model

This part contains any number of proper names assigned to the container item. These can be anthroponyms, toponyms, etc.

Each proper name has a language, an optional tag used to further classifiy it, a set of portions building up the name, and an optional assertion to represent the certainty level of the name and its related documental references.

The portions building up the name can be of any type: each portion just has a string value and a type. Types usually come from a thesaurus. For instance, in the Roman world we might represent a name like `Publius Vergilius Maro` as:

- praenomen: `Publius`
- nomen: `Vergilius`
- cognomen: `Maro`

In this case, we would have a list of types like praenomen, nomen, cognomen, agnomen, signum, and the like. Also notice that there is no constraint in their usages, so we might well have e.g. many cognomina for the same person. The list of types is up to the project.
