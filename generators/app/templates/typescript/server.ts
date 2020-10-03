import 'graphql-import-node';
import Mongoose from 'mongoose';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from 'apollo-server';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import * as dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';

import user from './graphql/schemas/user.graphql';
import userResolver from './graphql/resolvers/userResolver';

dotenv.config();

Mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
  autoIndex: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  dbName: process.env.DB_NAME,
});

const types = mergeTypeDefs([user]);
const resolvers = mergeResolvers([userResolver]);

const schema = makeExecutableSchema({
  typeDefs: types,
  resolvers: resolvers,
});

const server = new ApolloServer({
  schema: schema,
  playground: true,
  introspection: true,
  tracing: true,
  engine: {
    debugPrintReports: true,
  },
  context: ({ req }) => {
    const token = req.headers.authorization;
    if (token) {
      const jwt = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      return {
        user: {
          id: jwt.id,
        },
      };
    }
  },
});

const app = express();
server.applyMiddleware({ app });

const port = 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('server is running on: ' + port);
});
