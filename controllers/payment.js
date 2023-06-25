
    const Users = require('../models/Users');
    const asyncHandler = require('../middleware/async');
    const config = require("../config/config");
    let crypto = require("crypto");


    // app.post("/pay", function (req, res) {
    let key = config.production.key; // production key
    let salt = config.production.salt; // production key

    exports.payment = asyncHandler(async (req, res) => {
        console.log("data", req.body)

          let data = req.body
          
          //generate hash with mandatory parameters and udf5
          let cryp = crypto.createHash("sha512");
      
          // "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
          let text =
            key +
            "|" +
            data.txnId +
            "|" +
            data.amount +
            "|" +
            data.productInfo +
            "|" +
            data.firstName +
            "|" +
            data.email +
            "|" +
            data.temp +
            "|" +
            data.phone +
            "|||" +
            data.serviceProvider +
            "||||||" +
            salt;
    
            console.log("text", text)
          cryp.update(text);
          let hash = cryp.digest("hex");
          console.log("hash", hash)
          res.end(JSON.stringify(hash));
  });