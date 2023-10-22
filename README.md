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

To open a shell directly in the db container and connect to the db:

```sh
docker exec -it mediconnect-db psql -U postgres -d mediconnect
```

### Migrations
Inside `mediconnect-api` container:

```sh
# Generate a migration
npm run typeorm migration:generate src/migrations/<migration-name>
# Run migrations
npm run typeorm migration:run
# Revert migrations
npm run typeorm migration:revert
# Show migrations status
npm run typeorm migration:show
```

### Run seeds

```sh
docker cp ./src/scripts/seeds.sql mediconnect-db:/tmp/seeds.sql
docker exec -it mediconnect-db /bin/bash -c 'psql -U postgres -d mediconnect < /tmp/seeds.sql'
docker exec -it mediconnect-api /bin/bash -c 'npm run datasets:import'
```
ℹ️ `npm run datasets:import` will import the drug datasets from the `datasets` folder.

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

## Grafana

- <small>User : admin  / mdp : Azerty33!</small>

Configurer Grafana :
    - Search -> Data sources
    - Add -> PostgreSQL

Ajouter un graph avec Requete : 
    - Dashboard -> add/edit panel -> Data source : PostgreSQL
    - Créer sa requête
    - Save

Ajouter un graph avec End Point :
    -