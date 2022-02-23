const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean },
  series: { type: Array, required: true },
});

const User = model("user", UserSchema, "users");

module.exports = User;
