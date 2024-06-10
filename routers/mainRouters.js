var express = require("express");
var router = express.Router();


const userRoute = require("./user");
const pageRoute = require("./page");

const pageController = require("../controllers/pageController");

router.use("/", pageRoute)
router.use("/", userRoute)

router.route("*").get(pageController.get404Page);

module.exports = router;