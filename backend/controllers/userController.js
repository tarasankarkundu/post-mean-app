
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        username: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "user created!!",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    })
}

exports.loginUser = (req, res, next) => {
  let foundUser;
  console.log("userEmail ==",req.body.email);
  User.findOne({username: req.body.email}).then(user => {
    console.log("found ==",user);
    if (!user){
      return res.status(401).json({
        message: "User not found!!"
      })
    }
    console.log(user)
    foundUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result){
      return res.status(401).json({
        message: "Auth Failed!!"
      })
    }
    console.log("process.env.JWT_SECRET ===",process.env.JWT_SECRET);
    const token = jwt.sign(
      {email: foundUser.email, userId: foundUser._id},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    )
    console.log("token==",token)
    res.status(201).json({
      token: token,
      expiresIn: 3600,
      creator: foundUser._id
    })
  }).catch(err => {
    return res.status(401).json({
      message: "Auth Failed!!"
    })
  })
}
