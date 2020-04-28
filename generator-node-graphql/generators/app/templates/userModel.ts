import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  email: string,
  password: string,
}

const UserSchema = new mongoose.Schema({
  email: {
      type: String,
      required: true,
      unique: true
  },
  password: {
      type: String,
      required: true,
  }
});

export const UserModel = mongoose.model<User>('users', UserSchema);
