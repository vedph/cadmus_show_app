# Cadmus Show

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.1.

To run the corresponding Docker image: use `docker images` to list the images, and `docker run <image-name>` eventually adding `-d` to run detached and redirecting the port with `-p HOSTPORT:IMAGEPORT`.

Deploy sample (for a subpath, here `apps/cadmus-show`):

1. `npm run build-lib`
2. update `env.js` for version number
3. `ng build --configuration=production`

Building for a subfolder:

```bash
ng build --base-href /apps/cadmus-show/
```

Docker:

```bash
docker build . -t vedph2020/cadmus-show-app:1.0.4 -t vedph2020/cadmus-show-app:latest
```

For GitHub pages see [this tool](https://github.com/angular-schule/angular-cli-ghpages).

## History

- 2023-01-05:
  - updated to Angular 15
  - updated packages
  - replaced Akita with ELF
  - removed `@angular/flex-layout`
