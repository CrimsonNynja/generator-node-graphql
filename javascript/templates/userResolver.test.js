import { mergeTypeDefs } from '@graphql-tools/merge';
import EasyGraphQLTester from 'easygraphql-tester';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import dotenv from 'dotenv';
import * as dbHandler from '../dbHandler';

import { UserModel } from '../../src/models/userModel.js';
import user from '../../src/graphql/schemas/user.graphql';
import userResolver from '../../src/graphql/resolvers/userResolver.js';

dotenv.config();

const schema = mergeTypeDefs([user], { useSchemaDefinition: true, forceSchemaDefinition: true });

let tester = null;
beforeAll(async () => {
  dbHandler.connect();
  tester = new EasyGraphQLTester(schema, userResolver);
});
afterEach(async () => dbHandler.clearDatabase());
afterAll(async () => dbHandler.closeDatabase());

const fillDB = async (num) => {
  const models = [];
  for (let i = 0; i < num; i += 1) {
    const password = faker.internet.password();
    const user = new UserModel({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: await bcrypt.hash(password, 10),
    });
    await user.save();
    user.password = password;
    models.push(user);
  }
  return models;
};

test('test signup resolver', async () => {
  const mutation = `
    mutation signup($username: String!, $email: String!, $password: String!) {
      signup(username: $username, email: $email, password: $password)
    }
  `;

  tester.test(true, mutation, {
    username: 'username',
    email: 'hudoc96@hotmail.com',
    password: 'password',
  });

  const result = await tester.graphql(mutation, {}, {}, {
      username: 'username',
      email: 'hudoc96@hotmail.com',
      password: 'password',
    }
  );

  expect(result.data.signup.length).not.toBe(0);
});

test('test login resolver', async () => {
  const user = await fillDB(4);
  const mutation = `
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password)
    }
  `;

  tester.test(true, mutation, {
    email: user[0].email,
    password: user[0].password,
  });

  let result = await tester.graphql(mutation, {}, {}, {
    email: user[0].email,
    password: user[0].password,
  });

  expect(result.data.login.length).not.toBe(0);

  result = await tester.graphql(mutation, {}, {}, {
    email: user[0].email,
    password: 'fake',
  });
  expect(result.errors[0].message).toBe("Incorrect log in details");

  result = await tester.graphql(mutation, {}, {}, {
    email: 'fake',
    password: 'fake',
  });
  expect(result.errors[0].message).toBe("No user with that email");
});

describe('loggedInUser resolver', () => {
  let users
  const query = `
    query TEST {
      loggedInUser {
        id
      }
    }
  `;

  beforeEach(async () => {
    users = await fillDB(1);
  });

  test('test for non auth user', async () => {
    const result = await tester.graphql(query, undefined, {});
    expect(result.errors[0].message).toBe("You are not authenticated!");
  });

  test('test for auth user', async () => {
    const result = await tester.graphql(query, undefined, { user: users[0] });

    expect(result.errors).toBe(undefined);
    expect(result.data.loggedInUser).not.toBe(undefined);
    expect(result.data.loggedInUser.id.toString()).toEqual(users[0].id.toString());
  });
});
