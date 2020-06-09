# generator-node-graphql

[![NPM version][npm-image]][npm-url]
[![Dependency Status][daviddm-image]][daviddm-url]
![Node.js CI](https://github.com/CrimsonNynja/generator-node-graphql/workflows/Node.js%20CI/badge.svg)

> generates a node project with graphql and JWT

## Installation

First, install [Yeoman](http://yeoman.io) and generator-node-graphql using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-node-graphql
```

Then generate your new project:

```bash
yo node-graphql
```

## Generated code

If all default options are entered, the code generated should include a few runnable tests, as well as a runnable server.

### Tests

The generated tests are written using [Jest](JEST) and provide an in memory database using [mongodb-memory-server](MONGO-MEMORY), as well as means to test any graphql resolvers and schema validations using [easygraphql-tester](EASY-GRAPHQL).

The tests can be run as soon as the code is generated with:

```bash
npm run test
```

And a coverage report by:

```bash
npm run coverage
```

### Source Code

The source code uses [apollo-server-express](APOLLO-EXPRESS) along with [express](EXPRESS) for graphql and the server, with the [jsonwebtoken](JWT) package to handle JWTs. It also uses [lodash](LODASH), [merge-graphql-schemas](MERGE-GRAPHQL) and [graphql-import-node](GRAPHQL-IMPORT) for ease of use, as well as [dotenv](DOTENV) for its environment files.

The server can be run with nodemon by:

```bash
npm run dev
```

### Database

By default the chosen database is noSQL, which uses the [mongoose](MONGOOSE) package (keep in mind noSQL is currently the only option you can use). While the tests can run fine without any setup here, to properly run the server an instance of [mongoDB](MONGODB) should be created for the system to connect to. Please check the `.env` file and place your database credentials there.

### What the code can do

Out of the box, if you have already set up a database, run the server and navigate to `localhost:<PORT>/graphql`

Out of the box, the system provides methods for creating a user, logging in and checking the logged in user (all methods using JWT for auth). If you navigate to the `user.graphql` file, you can see the provided mutations. Feel free to extend this here for your own system. But for now, if we want to create a user, we can simply enter the following in graphql playground

```gql
mutation {
  signup(username: "user", email: "test@email.com", password: "password")
}
```

Which will create a new user and return us a token.

From here we can either use that token or test the login, which we can do like this:

```gql
mutation {
  login(email: "test@email.com", password: "password")
}
```

The above also returns us a token. So now, let's verify and check who is currently logged in with our token.

In the `HTTP HEADERS` section in playground, enter the following

```JSON
{
    "Authorization": "<YOUR TOKEN THAT WAS RETURNED>"
}
```

With the following query:

```gql
query {
    loggedInUser {
        id
        email
        password
    }
}
```

And when run, we should get information about the user we logged into / created earlier.

### Directory Structure

The generated directory should look like this:

![directory structure](https://user-images.githubusercontent.com/7157784/83977198-011f8500-a942-11ea-9cf7-81de61aa74ab.png)

## License

MIT © [Hudson Cassidy]()

[npm-image]: https://badge.fury.io/js/generator-node-graphql.svg
[npm-url]: https://npmjs.org/package/generator-node-graphql
[daviddm-image]: https://david-dm.org/CrimsonNynja/generator-node-graphql.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/CrimsonNynja/generator-node-graphql

[JEST]: https://jestjs.io/
[MONGO-MEMORY]: https://github.com/nodkz/mongodb-memory-server
[EASY-GRAPHQL]: https://github.com/EasyGraphQL/easygraphql-tester
[APOLLO-EXPRESS]: (https://github.com/apollographql/apollo-server)
[EXPRESS]: https://expressjs.com/
[JWT]: https://github.com/auth0/node-jsonwebtoken
[LODASH]: https://lodash.com/
[MERGE-GRAPHQL]: https://github.com/Urigo/merge-graphql-schemas
[GRAPHQL-IMPORT]: https://github.com/ardatan/graphql-import-node
[DOTENV]: https://github.com/motdotla/dotenv
[MONGOOSE]: https://mongoosejs.com/
[MONGODB]: https://www.mongodb.com/
