const User = require("../models/user");
const Student = require("../models/student");
const Club = require("../models/club");
const Admin = require("../models/admin");
var md5 = require('md5');

// Admin Details

exports.getAdminDetailsById = (req, res, next, id) => {
  User.findById(id).exec((err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }
    req.details = admin;
    req.details.password = undefined;
    next();
  });
};

// Basic auth details
exports.getAdmin = (req, res) => {
  return res.json(req.details);
};

//Get admin profile details
exports.getAdminProfile = (req, res) => {
  var userId = req.details._id;
  Admin.findOne({ userId: userId }, (err, adminProfile) => {
    if (err || !adminProfile) {
      return res.status(400).json({
        error: "Admin profile does not exist"
      });
    }else{
      return res.json(adminProfile);
    }
  });
};

// Update Admin profile
exports.updateAdminProfile = (req, res) => {
  Admin.findOneAndUpdate(
    { userId: req.details._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, profile) => {
      if (err) {
        return res.status(402).json({
          error: "You are not authorized to update this profile"
        });
      }else{
        return res.json(profile);
      }
    }
  );
};


// Student Details
exports.getStudentById = (req, res, next, id) => {
  User.findOne({userid: id}).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in DB"
      });
    }else{
      req.studentDetails = user;
      console.log(user)
      req.studentDetails.password = undefined;
      next();
    }
  });
};


// Basic auth studentDetails
exports.getStudent = (req, res) => {
  return res.json(req.studentDetails);
};

// Get single Student
exports.getSingleStudent = (req, res) => {
  var userId = req.studentDetails.userid;
  Student.findOne({ studentId: userId }, (err, studentProfile) => {
    if (err || !studentProfile) {
      return res.status(400).json({
        error: "Student profile does not exist"
      });
    }else{
      return res.json(studentProfile);
    }
  });  
};

// Get all student Details
exports.getAllStudents = (req, res) => {
  Student.find()
    .exec((err, students) => {
      if (err) {
        return res.status(400).json({
          error: "No student found in DB"
        });
      }else{
        return res.json(students);
      }
    });
};


//Add Student
exports.addStudent = (req, res) => {

  var numberOfStudentPresent = () => {
     return new Promise((resolve, reject) => {
        Student.countDocuments({ clubName: req.body.club }, function(err, result) {
          if (err) {
            reject(err)
          }else{
            resolve(result)
          }
        });
     });
   };

   var clubCode = () => {
     return new Promise((resolve, reject) => {
        Club.findOne({ clubName: req.body.club }, function(err, result) {
          if (err) {
            reject(err)
          }else{
            resolve(result)
          }
        });
     });
   };

   var getNumberOfStudents = async () => {
      var result = await (numberOfStudentPresent());
      return result;
   };

   var getClubCode = async () => {
      var result = await (clubCode());
      return result;
   };


  Student.findOne({ email: req.body.email })
  .exec((err, student) => {
    if (student) {
      console.log(student)
      return res.status(403).json({
        error: "Email already exists"
      });
    }else{
      var studentSerial = null;
      var clubCode = null;

      // Get current number of students
      getNumberOfStudents().then(function(students) {
        studentSerial = students+1;

        // get club code
        getClubCode().then(function(club) {
          clubCode = club.clubCode;
          var studentAutoId = clubCode+"-"+studentSerial;

          //Save User basic details
          const user = new User({
            userid: studentAutoId,
            password: md5(studentAutoId+"@"+clubCode),
            name: req.body.name,
            usertype: "student",
            status: "active"
          });
          user.save((err, user) => {
            if (err) {
              return res.status(400).json({
                error: "Failed to save user details"
              });
            }else{
              //Save Student profile
              const student = new Student({
                userId: user._id,
                studentId: studentAutoId,
                name: req.body.name,
                guardianName: req.body.guardianName,
                club: req.body.club,
                category: req.body.category,
                dob: req.body.dob,
                address: req.body.address,
                phone: req.body.phone,
                email: req.body.email,
                emergencyContact: req.body.emergencyContact,
                currentStudent: true,
              });
              student.save((err, student) => {
                if (err) {
                  return res.status(401).json({
                    error: "Could not save profile details. Please try again with valid data"
                  });
                }else{
                  user.password = undefined;
                  return res.json(user);
                }
              });
            }
          });
        });
      });
    }
  });
};


// Update student profile
exports.updateStudentProfile = (req, res) => {
  // console.log(req.studentDetails)
  Student.findOneAndUpdate(
    { studentId: req.studentDetails.userid },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, profile) => {
      if (err) {
        return res.status(401).json({
          error: "Update failed"
        });
      }else{
        User.findOneAndUpdate(
          { userid: req.studentDetails.userid },
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

// Archive student
exports.archiveStudent = (req, res) => {
  
  Student.findOneAndUpdate(
    { studentId: req.studentDetails.userid },
    { $set: { currentStudent:false } },
    { new: true, useFindAndModify: false },
    (err, profile) => {
      if (err) {
        return res.status(401).json({
          error: "Update failed"
        });
      }else{
        User.findOneAndUpdate(
          { userid: req.studentDetails.userid },
          { $set:{ status: 'archived' } },
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