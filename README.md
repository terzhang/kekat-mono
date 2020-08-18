# Kekat Chat :cat2:

A monorepo containing the frontend and backend for the Kekat, a real time chat app written in TypeScript and powered by GraphQL.

> Still a huge work in progress. Contact me if you want to be involved or scold at my codes.

## Features

- Fully written in TypeScript! :eyeglasses:
- GraphQL API :rocket:: Build in Apollo-server with Express
- Real-Time Subscriptions: Uses Websockets to allow real-time interactions with the API.
- Authentication :key:: Make use of Session and JWT to authenticate Users
- Transactional Emails :envelope:: Nodemailer and SendGrid is used to send emails on events (confirmation, lost password, etc)

## Prerequisites

Make sure you have the following installed globally:

- [Yarn](yarnpkg.com) classic (1.x)
- [Lerna](https://github.com/lerna/lerna)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)

> Also install [http-server](https://www.npmjs.com/package/http-server) globally to start the frontend in a local server

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

### Start the front and back end together

```bash
yarn run start
```

> use `start:client` or `start:server` to start each separately

### or start both in development mode

This will enable hot module replacement

```bash
yarn run dev
```

> use `dev:client` or `dev:server` to start each separately

Now you can visit <http://localhost:8888> to see the App locally

## Note

Don't be surprised when the GraphQL schema get modified as a result of code change in the backend.

### Backend emitted schema

The backend emits/updates the GraphQL schema whenever it's started.

### generated types from schema

When you run the `dev` or `start` script, the project will generate new Typescript typings from the GraphQL Schema located in the `typegraphql` package if there were changes made to it.

## Acknowledgments

- The countless poorly written docs I've read
- The vast resources available on the internet
- Discord for inspiring me
- TypeScript for existing
- [Tristan](https://github.com/tristanMatthias) for introducing GraphQL to me
- [Ben Awad](https://github.com/benawad) for his awesome tutorials
- Myself for not giving up

## License

[Internet Software Consortium](https://www.isc.org/licenses/)
