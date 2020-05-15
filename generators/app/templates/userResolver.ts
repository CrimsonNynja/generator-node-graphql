import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { UserModel, User } from '../../models/userModel';

dotenv.config();

/**
 * resolver for the user schema, this also handles some JWT logic
 */
const UserResolver = {
  Query: {
    /**
     * gets the currently logged in user
     * This retrieves the user from the graphQL context
     * @return UserModel: the currently logged in user model
     * @throws You are not authenticated!: if no user is logged in
     */
    async loggedInUser(_, args, { user }: { user: User }) {
      console.log('req id: ' + user);
      if (!user) {
        throw new Error('You are not authenticated!');
      }
      const userModel = await UserModel.findById(user.id);
      return userModel;
    },
  },
  Mutation: {
    /**
     * creates a new user with the given information
     * @param username
     * @param email
     * @param password
     * @return the generated JWT for the new user
     */
    async signup(_, { username, email, password }: { username: string, email: string, password: string }) {
      const pass = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username: username,
        email: email,
        password: pass,
      });
      user.save();

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );
    },
    /**
     * tries to log in a user with the given details
     * @param email
     * @param password
     * @returns the JWT for the logged in user
     * @throws Incorrect log in details: if the user could not be found
     */
    async login(_, { email, password }: { email: string, password: string }) {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect log in details');
      }

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },
  },
};

export default UserResolver;
