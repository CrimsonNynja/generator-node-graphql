import Mongoose from 'mongoose';
import UserSchema from '../mongooseSchemas/UserSchema';

export const UserModel = Mongoose.model('User', UserSchema, 'Users')

export async function findById(id) {
  const user = await UserModel.findById(id, (err, user) => {
    if (err) {
      throw err;
    }
    return user;
  });

  return user;
}

export async function findByEmail(email) {
  const user = await UserModel.find({ email: email }, (err, user) => {
    if (err) {
      throw err;
    }
    return user;
  });

  return user;
}

export async function createUser(email, password) {
  const user = new UserModel();
  user.email = email;
  user.password = password;
  user.save();
}
