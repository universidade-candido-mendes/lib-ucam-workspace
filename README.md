# Ucam library workspace

This project is a workspace to build angular libraries, as explained in this [article](https://angular.io/guide/creating-libraries)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.0.

## Login from github registry

```bash
npm login --scope=@universidade-candido-mendes --registry=https://npm.pkg.github.com
```

## Install from main repo

```bash
npm install --registry=https://registry.npmjs.org/ 
```

## Local test

to test the library in the local environment, run the following codes:

In the workspace folder:

```sh
ng build <library name> && cd dist/<library name> && npm link && cd ../..
```

In the test project folder:

```sh
npm link <library name> && ng s
```

## To publish

```sh
cd dist/<library name> && npm publish --access public && cd ../..
```

## Links

- Repository: [https://github.com/universidade-candido-mendes/lib-ucam-workspace](https://github.com/universidade-candido-mendes/lib-ucam-workspace)
  - In case of sensitive bugs like security vulnerabilities, please contact
    cpd@ucam-campos.br directly instead of using issue tracker. We value your effort
    to improve the security and privacy of this project!

## Versioning

0.0.1.0

## Authors

- **Matheus Souza**: [@matheuscruzsouza - Github](https://github.com/matheuscruzsouza)

Please follow github and join us!
Thanks to visiting me and good coding!
