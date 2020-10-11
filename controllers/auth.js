const User = require("../models/user");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var md5 = require('md5');

exports.signin = (req, res) => {
  const { userid, password } = req.body;
  User.findOne({ userid }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User does not exist"
      });
    }

    else if (user) {
      hashedpassword = user.password;

      // if user is found check if the pasword matches
      if (hashedpassword != md5(password)) {
        return res.status(403).json({
          error: "Incorrect password"
        });
      }
      else if(user.status == 'archived'){
        return res.status(403).json({
          error: "Student Archived"
        });
      }
      else{
        //create token
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);
        //put token in cookie (15 mintes validity)
        res.cookie("token", token, { expire: new Date() + 15*60*1000 });

        //send response to front end
        const { _id, userid, name, usertype, status } = user;
        return res.json({ token, user: {  _id, userid, name, usertype, status } });
      }
    }
  });
};

// Signout logic
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully"
  });
};

//protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.details && req.auth && req.details._id == req.auth._id;
  if (!checker) {
    return res.status(402).json({
      error: "ACCESS DENIED"
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  var userId = req.auth._id;
  console.log(userId)
  User.findById (userId, (err, user) => {
    if (err || !user) {
      return res.status(402).json({
        error: "You are not ADMIN, ACCESS DENIED"
      });
    }
    else if(user){
      if (user.usertype != "admin") {
        return res.status(402).json({
          error: "You are not ADMIN, ACCESS DENIED"
        });
      }else{
        next();
      }
    }
  });
};
