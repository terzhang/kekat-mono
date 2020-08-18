# Kekat Chat :cat2:

A monorepo containing the front-end and back-end for the Kekat, a real time chat app written in TypeScript and powered by GraphQL.

## Features

- Fully written in TypeScript! :eyeglasses:
- GraphQL API :rocket:: Build in Apollo-server with Express
- Real-Time Subscriptions: Uses Websockets to allow real-time interactions with the API.
- Authentication :key:: Make use of Session and JWT to authenticate Users
- Transactional Emails :envelope:: Nodemailer and SendGrid is used to send emails on events (confirmation, lost password, etc)

## Prerequisite

Make sure you have the following installed globally:

- [Yarn](yarnpkg.com) classic (1.x)
- [Lerna](https://github.com/lerna/lerna)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

> Also install http-server globally for front end development

### Development on Windows

~~Get the official Redis windows port [here](https://github.com/MicrosoftArchive/redis)~~

Get the Redis port for Windows maintained [here](https://github.com/tporadowski/redis/)

## Get started

Clone this repo first

```bash
git clone https://github.com/terzhang/kekat-mono.git
```

install the dependencies

```bash
yarn
```

### Start both the front and back end

```bash
yarn run start
```

> use `start:client` or `start:server` to start each separately

### Start both the front and back end in development

This will enable hot module replacement

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
