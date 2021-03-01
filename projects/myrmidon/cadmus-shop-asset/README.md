# CadmusShopAsset

Cadmus shop asset-based service. This is used for a file-system based shop, included in the application assets for a server-less environment. The shop is structured in a root `shop` folder in the application's `assets` folder:

```txt
.
├── shop
│   ├── f
│   │   └── index.json
│   │       ├── <id-1>
│   │       │   ├── dsc.html
│   │       │   ├── model.txt
│   │       │   ├── slides.json
│   │       │       └── img
│   │       │           └── images and thumbs...
│   │       └── <id-2>
│   └── p
│       └── index.json
│           ├── <id-1>
│           └── <id-2>
└── 
```

- the shop has 2 sections: `f` for fragments, `p` for parts, with the same structure.
- the `index.json` file is the index of all the units in each section.
- each unit has its own folder, named after its ID. This folder includes a `dsc.html` file with its detailed description; a `model.txt` with its formal model; an optional `slides.json` with the list of its slides. The corresponding slides images and thumbnails are in an `img` subfolder.

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.2.

## Code scaffolding

Run `ng generate component component-name --project cadmus-shop-asset` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project cadmus-shop-asset`.
> Note: Don't forget to add `--project cadmus-shop-asset` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build cadmus-shop-asset` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build cadmus-shop-asset`, go to the dist folder `cd dist/cadmus-shop-asset` and run `npm publish`.

## Running unit tests

Run `ng test cadmus-shop-asset` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
