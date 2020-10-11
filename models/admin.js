var mongoose = require("mongoose");
const User = require("../models/user");

var adminSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    adminId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
    },
    currentAdmin: {
      type: Boolean,
      required: true,
    },
    profilePicture:{
      type: String
    }
  },
);

module.exports = mongoose.model("Admin", adminSchema);
