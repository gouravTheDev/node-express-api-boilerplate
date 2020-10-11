const User = require("../models/user");
const Student = require("../models/student");
const Payment = require("../models/payment");
var md5 = require('md5');
var Razorpay = require('razorpay');
const crypto = require('crypto');

exports.getStudentById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.details = user;
    req.details.password = undefined;
    next();
  });
};


// Basic auth details
exports.getStudent = (req, res) => {
  return res.json(req.details);
};

// Complete profile details
exports.getProfile = (req, res) => {
  var userId = req.details._id;
  Student.findOne({userId: userId} , (err, studentProfile) => {
    if (err || !studentProfile) {
      return res.status(400).json({
        error: "Student profile does not exist"
      });
    }else{
      req.profile = studentProfile;
      return res.json(req.profile);
    }
  });
};


// Update profile
exports.updateProfile = (req, res) => {
  Student.findOneAndUpdate(
    { userId: req.details._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, profile) => {
      if (err) {
        return res.status(402).json({
          error: "You are not authorized to update this user"
        });
      }else{
        User.findByIdAndUpdate(
          req.studentDetails._id,
          { $set: req.body },
          { new: true, useFindAndModify: false },
          (err, user) => {
            if (err) {
              return res.status(401).json({
                error: "Update failed"
              });
            }else{
              return res.json(profile);
            }
        })
      }
    }
  );
};

// Change password
exports.changepassword = (req, res) => {
  var password1 = req.body.password1;
  var password2 = req.body.password2;

  if (password1 != password2) {
    return res.status(403).json({
      error: "Passwords are not same"
    });
  }else{
    User.findByIdAndUpdate(
      req.studentDetails._id,
      { $set: {password: md5(password1)} },
      { new: true, useFindAndModify: false },
      (err, user) => {
        if (err) {
          return res.status(401).json({
            error: "Password Couldn't be changed"
          });
        }else{
          return res.json("Password Changed");
        }
    })
  }
};

// Start Payment
exports.startPayment = (req, res) => {
  var amountRcv = req.body.amount;
  var month = req.body.month;
  var instance = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });
  var options = {
    amount: amountRcv,  // amount in the smallest currency unit
    currency: "INR",
    receipt: req.details.userid+"-"+req.body.month
  };

  instance.orders.create(options, function(err, orderObj) {
    if (err) {
      return res.status(401).json({
        error: "Request could not be processed"
      });
    }else{
     const payment = new Payment({
        orderId: orderObj.id,
        userId: req.details._id,
        name: req.details.name,
        amount: orderObj.amount,
        currency: orderObj.currency,
        receipt: orderObj.receipt,
        month: req.body.month,
        status: 0,
      });
      payment.save((err, payment) => {
        if (err) {
          return res.status(401).json({
            // error: "Could not save data"
            error: err
          });
        }else{
          return res.json(orderObj);
        }
      });
    }
  });
};

// Process Payment
exports.processPayment = (req, res) => {
  var orderId = req.body.orderId;
  var razorpay_payment_id = req.body.razorpay_payment_id;
  var razorpay_order_id = req.body.razorpay_order_id;
  var razorpay_signature = req.body.razorpay_signature;
  
  // generating signature

  var generatedSignature = crypto.createHmac('sha256', process.env.RZP_KEY_SECRET).update(orderId + "|" + razorpay_payment_id).digest('hex');

  //Checking signature
  if (razorpay_signature == generatedSignature) {
    var paymentDetails = {
      paymentId: razorpay_payment_id,
      dateOfPayment: new Date().toISOString().slice(0,10),
      status: 1
    }
    //Update payment record, set status to 1
    Payment.findOneAndUpdate(
      { orderId: orderId },
      { $set: paymentDetails },
      { new: true, useFindAndModify: false } , (err, paymentDetails) => {
      if (err || !paymentDetails) {
        return res.status(401).json({
          error: "Could not save payment details"
        });
      }else{
        return res.json(paymentDetails);
      }
    });
  }else{
    return res.status(400).json({
      error: "invalid signature"
    });
  }
};