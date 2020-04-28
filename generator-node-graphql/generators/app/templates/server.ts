import 'graphql-import-node';
import Mongoose from 'mongoose';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as g from 'apollo-server-express';
import * as Lodash from 'lodash';
import { makeExecutableSchema } from 'apollo-server';
import { mergeTypes } from 'merge-graphql-schemas';
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser';
import jsonwebtoken from 'jsonwebtoken';

import user from './graphql/schemas/user.graphql';
import userResolver from './graphql/resolvers/userResolver';

dotenv.config();

Mongoose.connect(`mongodb://localhost:27017`, {
  autoIndex: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  dbName: 'yeoman',
});

const types = mergeTypes([
  user,
], { all: true });

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers: Lodash.merge(userResolver),
});

const server = new ApolloServer({
  schema: schema,
  playground: true,
  introspection: true,
  tracing: true,
  engine: {
    debugPrintReports: true
  },
  context: ({ req }) => {
    const token = req.headers.authorization
    if (token) {
      const jwt = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      return {user: {
        id: jwt.id
      }}
    }
  },
});

const app = express();
server.applyMiddleware({ app });

const port = 3000;
app.listen(port, err => {
  if (err) {
    console.log(err)
  }
  console.log('server is running on: ' + port);
});
