const sendEmail = require("../utils/sendEmail");
exports.sendMail = async (req, res) => {
  console.log("req ---------------"+req.body.email);

    const user= {
      email:req.body.email,
      name:req.body.name,
      password:req.body.password
    }
  console.log("user ---------------"+user);
    try {
      await sendEmail({
        email: user.email,
        subject: 'Confirmation mail',
        message:`Name : ${user.name} \nEmail : ${user.email} \nPassword : ${user.password}`,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
     console.log(error);
    }}

  
 