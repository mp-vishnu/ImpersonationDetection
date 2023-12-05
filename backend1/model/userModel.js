const mongoose = require("mongoose");

// First Schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Email"],
    trim: true,
  },
  password: {
    type: String,
    // required: [true, "Please Enter Password"],
    trim: true,
  },
  image: {
    type: Buffer, // Buffer data type for storing binary data
  },
});

// Export Models with collection names
const userModel = mongoose.model("registers", userSchema);

module.exports = {
  userModel
};