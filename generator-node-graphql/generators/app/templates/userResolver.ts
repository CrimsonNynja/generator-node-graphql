import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import * as UserModel from '../../models/userModel';

dotenv.config()

const UserResolver = {
  Query: {
    async loggedInUser (_, args, { user }) {
      if (!user) {
        throw new Error('You are not authenticated!')
      }

      return await UserModel.findById(user.id)
    },
  },
  Mutation: {
    async signup (_, { username, email, password }) {
      const user = await UserModel.create(
        email,
        await bcrypt.hash(password, 10)
      );

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      );
    },
    async login (_, { email, password }) {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password')
      }

      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
    },
  }
}

export default UserResolver;
