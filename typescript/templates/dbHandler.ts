import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongodb = new MongoMemoryServer();

/**
 * Connects to the in-memory database.
 */
export const connect = async () => {
  const uri = await mongodb.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    useCreateIndex: true,
  };

  await mongoose.connect(uri, mongooseOpts);
};

/**
 * Drops the database, closes the connection and stops mongodb.
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongodb.stop();
};

/**
 * Removes all the data for all db collections.
 */
export const clearDatabase = async () => {
  const { collections } = mongoose.connection;

  const resolve = [];
  Object.keys(collections).forEach((key) => {
    const collection = collections[key];
    resolve.push(collection.deleteMany({}));
  });

  await Promise.all(resolve);
};
