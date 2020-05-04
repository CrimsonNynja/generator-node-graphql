import mongoose from 'mongoose';

/**
 * provides an interface for typescript
 */
export interface User extends mongoose.Document {
  email: string;
  password: string;
}

/**
 * schema that represents the mongoose database models
 */
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = mongoose.model<User>('users', UserSchema);
