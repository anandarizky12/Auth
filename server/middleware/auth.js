const jwt = require('jsonwebtoken');
const User= require('../models/User');
const errorResponse = require('../utils/errorResponse');

// async function protect(req,res,next){
//     let token

//     if(req.headers.authorization && req.header.authorization.startswith('Bearer')){
//         token.req.headers.authorization.split(' ')[1]
//     }

//     if(!token){
//         return next(new errorResponse('NOt Authorized to acces this route',404))
//     }

//     try{
//         const decode  = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await User.findById(decoded.id);

//         if(!user){
//             return next(new errorResponse("no user found",404))
//         }

//         req.user= user;
//         next()
//     }catch(error){
//         return next(new errorResponse("not authorize to access this route",401));
//     }
// }

// module.exports = protect;

  
// const jwt = require("jsonwebtoken");
// const errorResponse = require("../utils/errorResponse");
// const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new errorResponse("Not authorized to access this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new errorResponse("No user found with this id", 404));
    }

    req.user = user;

    next();
  } catch (err) {
    return next(new errorResponse("Not authorized to access this router", 401));
  }
};