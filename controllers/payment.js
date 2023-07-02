
    const Users = require('../models/Users');
    const asyncHandler = require('../middleware/async');
    const config = require("../config/config");
    let crypto = require("crypto");
    const uniqid = require('uniqid'); 

    let key = config.production.key; // production key
    let salt = config.production.salt; // production key

    exports.paymentPage = asyncHandler(async (req, res) => {

      let ord = "ORD" + uniqid();
      res.render(__dirname + "/checkout1.html", { orderid: ord, key: key });

    })
  
    exports.payment = asyncHandler(async (req, res) => {
      var strdat = "";
    
      req.on("data", function (chunk) {
        strdat += chunk;
      });
      req.on("end", function () {
        var data = JSON.parse(strdat);
    
        //generate hash with mandatory parameters and udf5
        var cryp = crypto.createHash("sha512");
        console.log("data", data)
    
        var text =
          key +
          "|" +
          data.txnid +
          "|" +
          data.amount +
          "|" +
          data.productinfo +
          "|" +
          data.firstname +
          "|" +
          data.email +
          "|" +
          data.udf1 +
          "|" +
          data.udf2 +
          "|||" +
          data.udf5 +
          "||||||" +
          salt;
    
        cryp.update(text);
        var hash = cryp.digest("hex");
        res.end(JSON.stringify(hash));
      });
  });