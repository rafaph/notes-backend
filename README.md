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
yarn start                    // start server for prod env
yarn dev                      // start server for local env
yarn test                     // run all tests
yarn test:watch               // run all tests and watch
yarn test:integration         // run integration tests
yarn test:integration:watch   // run integration tests and watch
yarn test:unit                // run unit tests
yarn test:unit:watch          // run unit tests and watch
yarn test:ci                  // run all tests and generate coverage report
yarn lint                     // lint file names, folder names and ts files
yarn lint:fix                 // lint and fix
yarn build                    // compile project to dist folder
yarn migration:run            // apply database migrations
yarn migration:make           // make a database migration
```

4. Remove container:

```
make down
```
