# Cadmus Show

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

To run the corresponding Docker image: use `docker images` to list the images, and `docker run <image-name>` eventually adding `-d` to run detached and redirecting the port with `-p HOSTPORT:IMAGEPORT`.

Deploy sample (for a subpath, here `apps/cadmus-show`):

1. `npm run build-lib`;
2. update `env.js` and Docker scripts for version number;
3. `ng build --configuration=production`.

Building for a subfolder:

```bash
ng build --base-href /apps/cadmus-show/
```

🐋 Docker:

```bash
docker build . -t vedph2020/cadmus-show-app:2.0.3 -t vedph2020/cadmus-show-app:latest
```

For GitHub pages see [this tool](https://github.com/angular-schule/angular-cli-ghpages).

## History

- 2023-05-12: updated to Angular 16.
- 2023-03-11: updated Angular and packages.

### 2.0.3

- 2023-02-14: adjusted route order (more specific come first).

### 2.0.2

- 2023-02-14:
  - updated Angular and packages.
  - replaced [ngx color picker](https://www.npmjs.com/package/@angular-material-components/color-picker) as it [does not render well](https://github.com/h2qutc/angular-material-components/issues/303) with basic HTML input of type color.

### 2.0.1

- 2023-01-06: homepage

### 2.0.0

- 2023-01-05:
  - updated to Angular 15
  - updated packages
  - replaced Akita with ELF
  - removed `@angular/flex-layout`
