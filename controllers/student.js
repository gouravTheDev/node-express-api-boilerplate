const User = require("../models/user");
const Student = require("../models/student");
var md5 = require('md5');

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

