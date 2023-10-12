# MediConnect

API d'informations de médicaments

## Getting started

```sh
docker-compose up --build
```

Then open http://localhost:3000/api-docs, you should see the Swagger UI.

## Docker

### Run containers

```sh
docker-compose up
```

- <small>`--build` to build/rebuild the containers</small>
- <small>`-d` to run the containers in the background</small>

You can now access the following services:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs
- DB: http://localhost:5432
- Grafana: http://localhost:3003

### Open a shell in a container

```sh
docker exec -it mediconnect-api sh
docker exec -it mediconnect-db sh
docker exec -it mediconnect-grafana sh
```

### Stop all containers

```sh
docker-compose stop
```

### Remove all containers

```sh
docker-compose down
```

## Linter

- <small>Tester le linter</small>

```sh
npx eslint test.ts
```

- <small> 'npx eslint .' pour tout check</small>
