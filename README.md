# Notes Application Backend

1) Start container:

```
docker-compose up -d --build
```

2) Install dependencies:

```
docker-compose exec server sh
npm i
```

3) Run a any desired npm script:

```
npm run start
npm run test
npm run test:watch
npm run test:cov
npm run lint
npm run lint:fix
npm run build
npm run build:watch
```

4) Remove container:

```
docker-compose down --remove-orphans -t 30
```
