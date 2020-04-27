import 'graphql-import-node';
import { Mongoose } from 'mongoose';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as Lodash from 'lodash';
import { makeExecutableSchema } from 'apollo-server';
import { mergeTypes } from 'merge-graphql-schemas';
import * as dotenv from 'dotenv'

import user from './graphql/schemas/user.graphql';

import userResolver from './graphql/resolvers/userResolver';

dotenv.config();

const connection = Mongoose.connect(`mongodb+srv://${username}:${password}@${url}`, {
    autoIndex: true,
    poolSize: 50,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
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
