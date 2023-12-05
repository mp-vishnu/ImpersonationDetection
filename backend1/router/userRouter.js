const express = require("express");
const {
  userRegister,
  checkConnection,
  userPassword,
  userValidation
} = require("../controller/userController");
const faceController=require("../controller/detection/faceController.js");
const { sendMail } = require("../controller/mailController");
const upload = require("../middleware/multerMiddleware"); // Import multer middleware

const router = express.Router();

router.route("/connection").get(checkConnection);

//router.route('/register').post(upload.single('image'), userRegister); // Apply multer middleware to the 'register' route
router
  .route("/register")
  .post(upload.single("image"), (req, res) => userRegister(req, res));
//router.route('/register').post(upload.single('image'), (req, res) => userRegister(req, res, req.body.name));
router.route("/password").post(userPassword);
router.route("/email").post(sendMail);
router.route("/facedetection").post(faceController.faceDetection);
router.route("/validate").post(userValidation);
module.exports = router;
