const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        required : [true, "Please Input Username"]
    },
    email:{
        type : String,
        required : [true, "Please provide email"],
        unique : true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please input  a valid E-mail"
        ],
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
        select: false,
    },
    resetpasswordtoken:String,
    reserpasswordexpired:Date,

});


//to check if the password modified or not
UserSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    //if the password change then hash the data
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
    next();
})


//to check the password
UserSchema.methods.matchPasswords = async function(passwordfromclient){
    return await bcrypt.compare(passwordfromclient,this.password);
};

//to get token when register and login
UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE,
    });
};

UserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    // Hash token (private key) and save to database
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    // Set token expire date
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  
    return resetToken;
  };
const User = mongoose.model('User',UserSchema);

module.exports = User;



