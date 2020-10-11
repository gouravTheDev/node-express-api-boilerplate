var mongoose = require("mongoose");
const User = require("../models/user");

var paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
    },
    month: {
      type: String,
      required: true,
    },
    dateOfPayment: {
      type: Date,
    },
    status:{
      type: Number,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
