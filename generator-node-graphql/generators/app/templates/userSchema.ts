import Mongoose from 'mongoose';

const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

export default UserSchema;
