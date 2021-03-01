# Cadmus Show

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

## Architecture

### Profile Area

_Projects_:

- `cadmus-profile-core`: facet models and utility service.
- `cadmus-profile-ui`: components for editing a profile.

The profile area allows users to build a Cadmus profile, and has 3 sections:

- facets: facets with all the parts definitions.
- flags: items flags definitions.
- thesauri: thesauri.

#### Profile - Facets

Facets are displayed and edited using these components:

- _facets list_ (`FacetListComponent`): a list of editable facets. This uses `FacetView` for each facet, `FacetMetadatEditor` to edit each facet's metadata, and `PartDefinitionEditor` to edit a part definition inside a facet.
- _facets list code_ (`FacetListCodeComponent`): the JSON code corresponding to the list of facets.

Both these components save their data in the `FacetListStore`.

#### Profile - Flags

TODO

#### Profile - Thesauri

- thesauri list: a list of editable thesauri.
- thesauri code: the JSON code corresponding to the list of thesauri.

TODO

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
