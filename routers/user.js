const express = require("express")

const router = express.Router();

const redirect = require('../middlewares/redirect')

const userController = require("../controllers/userController");

router.route("/giris").get(redirect, userController.getLoginPage);
router.route("/giris").post(redirect, userController.login);
router.route("/logout").get(userController.logout);
router.route("/register").get(userController.getRegisterPage);
router.route("/register").post(userController.postRegister);
router.route("/add-favorite").post(userController.addFavorite);
router.route("/favoriler").get(userController.getFavorites);
router.route("/uyepaneli").get(userController.getUyePaneli);
router.post('/addUserFavorite', userController.addUserFavorite);
router.get('/favoriler', userController.getFavorites);
router.post('/deleteGoogleFavorite', userController.deleteGoogleFavorite);
router.post('/deleteUserFavorite', userController.deleteUserFavorite);
router.post('/updateUserFavorite', userController.updateUserFavorite);
router.post('/rateAndReview', userController.rateAndReview);

router.get('/profile', userController.getProfilePage);
router.post('/profile', userController.updateProfile);

module.exports = router; 