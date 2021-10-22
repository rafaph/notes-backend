# Notes Application Backend

1. Start container:

```
make shell
```

2. Install dependencies:

```
yarn install --frozen-lockfile
```

3. Run a any desired yarn script:

```
yarn start                   // starts for prod env
yarn dev                     // starts for local env
yarn test                    // test all
yarn test:watch              // watch test all
yarn test:integration        // test integration
yarn test:integration:watch  // test integration
yarn test:unit               // test unit
yarn test:unit:watch         // watch test unit
yarn test:ci                 // test all with coverage report
yarn lint                    // lint file names, folder names and ts files
yarn lint:fix                // lint and fix
yarn build                   // compile project to dist folder
yarn migration:run           // apply database migrations
```

4. Remove container:

```
make down
```
