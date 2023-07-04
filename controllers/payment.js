
    const Users = require('../models/Users');
    const asyncHandler = require('../middleware/async');
    const config = require("../config/config");
    let crypto = require("crypto");
    const uniqid = require('uniqid'); 

    let key = config.production.key; // production key
    let salt = config.production.salt; // production key

  
    exports.payment = asyncHandler(async (req, res) => {
      let email = req.body.email;
      let findEmail = await Users.find({email : email})
      console.log("findEmail", findEmail);

      if(findEmail.length !==0 ){
        res.status(200).send({message: "User can do payment"})
      } else {
        res.status(400).send({message: "User can not do payment"})
      }

  }); 