var express = require("express");
var router = express.Router();
const { signin, signout } = require("../controllers/auth");

// Signin Route
router.post("/signin", signin);

//signout route
router.post("/signout", signout);

module.exports = router;
