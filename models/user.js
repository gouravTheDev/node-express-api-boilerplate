var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name:{
      type: String,
      required: true,
    },
    usertype:{
      type: String, 
      required: true,
    },
    status:{
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
