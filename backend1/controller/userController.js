const upload = require('../middleware/multerMiddleware');
const { userModel} = require("../model/userModel");

function generateRandomPassword() {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}

 //get all items
 exports.checkConnection = (req, res) => {
   res.status(200).json({ message: "route working" });
 };
 // create new row and save

// ... (other imports and code)

// create new row and save
exports.userRegister = async (req, res) => {
  console.log("inside userreg controller ----------------")
  try {
   
    // req.file is available because of the multer middleware
    const image= req.file.buffer;
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    console.log("name--email--password--image"+name+" "+email+" "+password) 

    // Assuming 'name' is a field in your form
   // const name = req.body.name;

    // Use 'name' and 'image' in your create function
    const data = await userModel.create({ name,email,password,image });
   // console.log("--- typeof image---"+typeof(image));
   if(data)
   {
    
    res.status(200).json({
      success: true,
      data
    });
   }
   else{
    res.status(201).json({
      success: false,
    });
   }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

// exports.userPassword = async (req, res) => {
//   const randomPassword=generateRandomPassword();
//   try {
//     // Check if the generated password already exists in the database
//     const existingUser = await userModel.findOne({ password: randomPassword });

//     if (existingUser) {
//       // Password already exists, generate a new one and recursively call the function
//       return userPassword(req, res);
//     }

//     // If the control reaches here, the password doesn't exist in the database
//     res.status(200).json({
//       success: true,
//       password: randomPassword,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: 'Internal Server Error',
//     });
//   }
// };
exports.userPassword = async (req, res) => {
  try {
    // Check if the email already exists in the database
    
    //const existingEmail = await userModel.findOne({ email: req.body.email });
    // if (existingEmail) {
    //   return res.status(201).json({
    //     success: true,
    //     message: 'Email already exists. Please use a different email.',
    //   });
    // }

    let randomPassword;
    let existingPassword=null

    do {
      // Generate a new password
      randomPassword = generateRandomPassword();

      // Check if the generated password already exists in the database
      existingPassword = await userModel.findOne({ password: randomPassword });

      // If the password already exists, continue the loop to generate a new one
    } while (existingPassword);

    // If the control reaches here, the email doesn't exist, and password is generated and saved
    res.status(200).json({
      success: true,
      password: randomPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

exports.userValidation = async (req, res) => {
  try {
    // Check if the email and password match in the database
    const existingUser = await userModel.findOne({ email: req.body.email, password: req.body.password });
    //const referenceImage = Buffer.from(existingUser.image, 'binary');
    const referenceImage = existingUser.image.toString('base64');
    if (existingUser) {
      // Email and password match, handle accordingly
      return res.status(200).json({
        success: true,
        message: 'user found.',
        image:referenceImage// Include the image data
      });
    } else {
      // Email and password do not match, handle accordingly
      return res.status(201).json({
        success: false,
        message: 'user not found.',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};


// ... (other code)

