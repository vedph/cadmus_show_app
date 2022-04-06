# Cadmus Show

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

To run the corresponding Docker image: use `docker images` to list the images, and `docker run <image-name>` eventually adding `-d` to run detached and redirecting the port with `-p HOSTPORT:IMAGEPORT`.

Deploy sample (for a subpath, here `apps/cadmus-show`):

```bash
ng build --base-href /apps/cadmus-show/
```

or just `ng build --configuration=production`. To create the image:

```bash
docker build . -t vedph2020/cadmus-show-app:1.0.0 -t vedph2020/cadmus-show-app:latest
```

For GitHub pages see [this tool](https://github.com/angular-schule/angular-cli-ghpages).

## Architecture

Libraries and their dependencies:

- `@myrmidon/cadmus-profile-core` (build-core)
- `@myrmidon/cadmus-shop-core` (build-core)
- `@myrmidon/cadmus-shop-asset` (build-shop)
- `@myrmidon/cadmus-show-ui` (build-ui)
  - `@myrmidon/cadmus-shop-core`
- `@myrmidon/cadmus-profile-ui` (build-prof)
  - `@myrmidon/cadmus-profile-core`
  - `@myrmidon/cadmus-shop-asset`
  - `@myrmidon/cadmus-show-ui`
- `@myrmidon/cadmus-shop-ui` (build-shop)
  - `@myrmidon/cadmus-shop-asset`
  - `@myrmidon/cadmus-show-ui`
  - `@myrmidon/cadmus-profile-ui`

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
