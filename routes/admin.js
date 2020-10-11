const express = require("express");
const router = express.Router();

const { getAdminDetailsById, getAdmin, getAdminProfile, updateAdminProfile, getStudentById, getStudent, getAllStudents, getSingleStudent, addStudent,  updateStudentProfile, archiveStudent } = require("../controllers/admin");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// WITHOUT PARAMS
//add student
router.post("/admin/addstudent", isSignedIn, isAdmin, addStudent);

//get all students list
router.get("/admin/students", isSignedIn, isAdmin, getAllStudents);

//WITH PARAMS
router.param("studentId", getStudentById);
router.param("adminId", getAdminDetailsById);

// Get admin details
router.get("/admin/:adminId", isSignedIn, isAdmin, isAuthenticated, getAdmin);

//Get admin profile details
router.get("/admin/:adminId/profile", isSignedIn, isAuthenticated, isAdmin, getAdminProfile);

//update Admin profile
router.put("/admin/:adminId/profile", isSignedIn, isAuthenticated, updateAdminProfile);

//get single student
router.get("/admin/students/:studentId", isSignedIn, isAdmin, getSingleStudent);

//update student
router.put("/admin/students/:studentId", isSignedIn, isAdmin, updateStudentProfile);

//Archive student
router.put("/admin/archivestudent/:studentId", isSignedIn, isAdmin, archiveStudent);


module.exports = router;
