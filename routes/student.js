const express = require("express");
const router = express.Router();

const { getStudentById, getStudent, getProfile, updateProfile, changepassword } = require("../controllers/student");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");


router.param("studentId", getStudentById);

//get studentDetails route
router.get("/student/:studentId", isSignedIn, isAuthenticated, getStudent);

//get profile route
router.get("/student/:studentId/profile", isSignedIn, isAuthenticated, getProfile);

//update route
router.put("/student/:studentId/profile", isSignedIn, isAuthenticated, updateProfile);

//Change password
router.put("/student/:studentId/changepassword", isSignedIn, isAuthenticated, changepassword);


module.exports = router;
