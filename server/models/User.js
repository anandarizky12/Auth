const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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



UserSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.matchPasswords = async function(passwordfromclient){
    return await bcrypt.compare(passwordfromclient,this.password);
};

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE,
    });
};

  
const User = mongoose.model('User',UserSchema);

module.exports = User;



