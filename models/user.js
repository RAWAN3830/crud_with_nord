const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
      validate: {
        validator: () => Promise.resolve(false),
        message: "Username is required",
        
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;