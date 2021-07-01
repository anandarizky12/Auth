const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');



exports.register= async (req,res,next)=>{

        
        const {username,email,password} = req.body;

        try{
        
                const user = await User.create({
                        username,email,password
                });

             //send token if success   
             sendToken(user,200,res)
        }catch(error){
             res.status(400).json({
                     success:false ,
                     message : error

             })
        }

}


exports.login=async (req,res,next)=>{
      const {email,password} = req.body;

      if(!email || !password){
              return next(new errorResponse("Please Provide Email and Password",400))
      }

      try{
                const user = await User.findOne({email}).select("+password");

                if(!user){
                        return next(new errorResponse("Invalid Email or Password",401))
                }

                const isMatch =  await user.matchPasswords(password);

                if(!isMatch){
                        return next(new errorResponse("Invalid Email or Password",401))
                }

              
             //send token if success   
             sendToken(user,200,res)

      }catch(error){
            next(error);
      }

}

exports.forgotpassword=(req,res,next)=>{
        // Send Email to email provided but first check if user exists
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No email could not be sent", 404));
    }

    // Reset Token Gen and add to database hashed (private) version of token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset url to email to provided email
    const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

    // HTML Message
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please make a put request to the following link:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, data: "Email Sent" });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save();

      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } catch (err) {
    next(err);
  }
}

exports.resetpassword=(req,res,next)=>{
        res.send("Reset Password Route")
}
//to send the token
const sendToken = (user, statusCode, res)=>{
        const token = user.getSignedToken();
        res.status(statusCode).json({
                success :true,token
        })
}
