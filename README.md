# Kekat Chat

A Chat app in development.
Written in typescript and powered by GraphQL.

## Prerequisite

Make sure you have the following installed globally:

- Yarn (classic 1.x)
- Lerna
- PostgreSQL
- Redis

> Also install http-server globally if you want to start the front end for local development

## Get started

### Install the dependencies first

```bash
yarn
```

### Start both the front and back end

```bash
yarn run start
```

> use `start:client` or `start:server` to start each separately

### Start both the front and back end in development

This will enable hot module reloading

```bash
yarn run dev
```

> use `dev:client` or `dev:server` to start each separately

## Note

Don't be surprised when the GraphQL schema get modified as a result of code change in the backend.

### Backend emitted schema

The backend emits/updates the GraphQL schema whenever it's started.

### generated types from schema

When you run the `dev` or `start` script, the project will generate new Typescript typings from the GraphQL Schema located in the `typegraphql` package if there were changes made to it.
