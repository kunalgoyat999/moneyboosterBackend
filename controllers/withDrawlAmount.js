
    const Users = require('../models/Users');
    const asyncHandler = require('../middleware/async');
    const config = require("../config/config");
    let crypto = require("crypto");
    const uniqid = require('uniqid'); 

    let key = config.production.key; // production key
    let salt = config.production.salt; // production key

  
    exports.withDrawAmount = asyncHandler(async (req, res) => {
      let email = req.body.email;
      let amount = req.body.amount;
      amount = parseInt(amount)
      let findEmail = await Users.find({email : email})
      console.log("findEmail", findEmail);

      if(findEmail.length !==0 ){
        let currentAmount = parseFloat(findEmail[0].amountToBeUse);
        console.log("newAmount1", currentAmount)
        currentAmount -= amount;
        console.log("newAmount2", currentAmount)

        let currentWithDrawAmount = findEmail[0].amountWithraw || 0
        currentWithDrawAmount = parseFloat(currentWithDrawAmount);
        console.log("currentWithDrawAmount1", currentWithDrawAmount)
        currentWithDrawAmount += amount;
        console.log("currentWithDrawAmount2", currentWithDrawAmount)

        findEmail = await Users.findOneAndUpdate(
            { email: email },
            { $set: { 
                    amountToBeUse: currentAmount.toString(),
                    amountWithraw: currentWithDrawAmount.toString() 
                } 
            },
            { new: true }
          );
          console.log("findEmail", findEmail)
        res.status(200).send({message: "WithDrawlAmount Success", data: findEmail});
      } else {
        res.status(400).send({message: "Email Not Exists"})
      }

  }); 