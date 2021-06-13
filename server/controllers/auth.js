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
        res.send("Forgot Password Route")
}
exports.resetpassword=(req,res,next)=>{
        res.send("Reset Password Route")
}

const sendToken = (user, statusCode, res)=>{
        const token = user.getSignedToken();
        res.status(statusCode).json({
                success :true,token
        })
}
