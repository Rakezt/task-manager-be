const mongoose = require('mongoose');

const taskuserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Taskuser', taskuserSchema);
