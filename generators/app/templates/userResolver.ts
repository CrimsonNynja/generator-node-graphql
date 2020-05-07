import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import { UserModel, User } from '../../models/userModel';

dotenv.config();

/**
 * resolver for the user type, this also handles some JWT logic
 */
const UserResolver = {
  Query: {
    async loggedInUser(_, args, { user }: User) {
      console.log('req id: ' + user);
      if (!user) {
        throw new Error('You are not authenticated!');
      }
      const userModel = await UserModel.findById(user.id);
      return userModel;
    },
  },
  Mutation: {
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
    async login(_, { email, password }: { email: string, password: string }) {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
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
