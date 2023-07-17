/** dotenv support */
require('dotenv').config();
const path = require('path');
const express = require('express');
const colors = require('colors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require("express-session");
const cors = require('cors');
const uniqid = require('uniqid'); 
const config = require("./config/config");
let crypto = require("crypto");
const Users = require("./models/Users");
const request = require("request"); //required for verify payment
require("./controllers/cronjob")
/*** Connect to database */
connectDB()


/** load route files */
const userDetails = require('./routes/index')

/** initilize express */
const app = express();

/** add body-parser to app.js */
// app.use(
//   cors({
//     origin: ['https://moneybooster.netlify.app', 'http://localhost:3000'],
//   })
// )

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "mcg001k", saveUninitialized: true, resave: true }));
app.use(express.static(__dirname + "/"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.set("views", __dirname);

let key = config.production.key; // production key
let salt = config.production.salt; // production key

let ord = "ORD" + uniqid();
app.get("/pay", function (req, res) {
  console.log("heree", ord)
  // let ord = "ORD" + uniqid();
  res.render(__dirname + "/checkout1.html", { orderid: ord, key: key });
});

// 0j7zny|ORDcz19klavmljldl13y|1|P01,P02|Kunal|kunal.groobizz@gmail.com|none||||PayUBiz_NODE_JS_KIT||||||0bEORCg1
// 0j7zny|ORDcz19klay7ljldnj3y|50|asdasd|Kunal|kunal.groobizz@gmail.com|none|88888|||PayUBiz_NODE_JS_KIT||||||0bEORCg1
app.post("/pay", function (req, res) {

  console.log("heeeedssdsdsas", req.body)
  let strdat = "";

  req.on("data", function (chunk) {
    strdat += chunk;
  });
  req.on("end", function () {
    let data = JSON.parse(strdat);

    //generate hash with mandatory parameters and udf5
    let cryp = crypto.createHash("sha512");
    console.log("data", data)

    // "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
    let text =
      key +
      "|" +
      ord +
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

      console.log("text", text)

    cryp.update(text);
    let hash = cryp.digest("hex");
    res.end(JSON.stringify(hash));
  });
}); 

app.post("/response.html", async function (req, res) {
  let verified = "No";
  let txnid = req.body.txnid;
  let amount = req.body.amount;
  let productinfo = req.body.productinfo;
  let firstname = req.body.firstname;
  let email = req.body.email;
  let udf1 = req.body.udf1; // referral by
  let udf2 = req.body.udf2; // number of questions
  let udf5 = req.body.udf5;
  let mihpayid = req.body.mihpayid;
  let status = req.body.status;
  let resphash = req.body.hash;
  let txnDate = req.body.addedon;
  let mode = req.body.mode;
  let state = req.body.state;
  let additionalcharges = "";

  //Calculate response hash to verify
  let keyString =
    key +
    "|" +
    txnid +
    "|" +
    amount +
    "|" +
    productinfo +
    "|" +
    firstname +
    "|" +
    email +
    "|" +
    udf1 +
    "|" +
    udf2 +
    "|||" +
    udf5 +
    "|||||";

  let keyArray = keyString.split("|");
  let reverseKeyArray = keyArray.reverse();
  let reverseKeyString = salt + "|" + status + "|" + reverseKeyArray.join("|");
  //check for presence of additionalcharges parameter in response.
  if (typeof req.body.additionalCharges !== "undefined") {
    additionalcharges = req.body.additionalCharges;
    //hash with additionalcharges
    reverseKeyString = additionalcharges + "|" + reverseKeyString;
  }

  //Generate Hash
  let cryp = crypto.createHash("sha512");
  cryp.update(reverseKeyString);
  let calchash = cryp.digest("hex");
  let msg =
    "Payment failed for Hash not verified...<br />Check Console Log for full response...";
  //Comapre status and hash. Hash verification is mandatory.
  if (calchash == resphash) {
    msg =
      "Transaction Successful and Hash Verified...<br />Check Console Log for full response...";
  }



  //Verify Payment routine to double check payment
  let command = "verify_payment";

  let hash_str = key + "|" + command + "|" + txnid + "|" + salt;
  let vcryp = crypto.createHash("sha512");
  vcryp.update(hash_str);
  let vhash = vcryp.digest("hex");

  let options = {
    method: "POST",
    uri: config.production.uri,
    form: {
      key: key,
      hash: vhash,
      var1: txnid,
      command: command,
    },
  };

  // if isTrue ture means his transection is successfully completed.
  let isTrue;

  await request(options, (error, res, body) => {
    if (error) {
      // loggerMongoDB.error(`pay40 -- request failed to stripe dashboard -- error -- ${error} -- `)
      return console.error("upload failed:", error);
    }

    if (res.statusCode == 200) {
      return (isTrue = true);
    }
  });

  if (status === "success") {
    let emailUser = await Users.find({email: email});
    console.log("emailUser", emailUser, typeof amount);
    if (emailUser) {
      let numberAmount = parseFloat(amount);

       // Calculate the new amount
      if(emailUser[0].amounAdded === undefined){
        // Update the amountAdded field in the user document
        emailUser = await Users.findOneAndUpdate(
          { email: email },
          { 
            $set: { 
              amounAdded: amount,
              amountToBeUse: amount 
            } 
          },
          { new: true }
        );
      } else {
        let newAmount = parseFloat(emailUser[0].amounAdded);
        newAmount += numberAmount;

        let assestAmount = parseFloat(emailUser[0].amountToBeUse) || 0;
        assestAmount += numberAmount;
        // Update the amountAdded field in the user document
        console.log("assestAmount", assestAmount, "typeof assestAmount", typeof assestAmount,"assestAmount.toString()", assestAmount.toString(), "typeof assestAmount.toString()", typeof assestAmount.toString())
        const currentDate = new Date();
        let recharge = {
          type: "Recharge",
          date: currentDate,
          amount: numberAmount
        }
        emailUser = await Users.findOneAndUpdate(
          { email: email },
          {
            $set: {
              amounAdded: newAmount.toString(),
              amountToBeUse: assestAmount.toString(),
            },
            $push: { accountRecord: recharge }
          },
          { new: true }
        );
      }
      console.log("Updated user:", emailUser);
    }
    return res.render(__dirname + "/response.html", {amount: amount});
  } else {
    return res.send(`payment fail`);
  }
});


app.use(bodyParser.json());
app.use(express.json());
/** Static file upload */

/** Mount routers */
app.use('/api/v1/userDetails', userDetails);

/** Check server is up */
// app.get(`/api/v1/health-check`, (req, res) => {
//   res.send("All good ✅✅");
// });

app.get('/', (req, res)=> {
    console.log("heree")
    res.send("Okay")
})



/** set port for express */
app.set('port', (process.env.PORT || 3333));

/** express port is listening */
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

/** Handle unhandled promise rejections */
// process.on(`unhandledRejection`, (err, promise) => {
//   logger.error(`Error: ${err.message}`.red.inverse);
//   logger.alert(`Error: ${err.message}`.red.inverse);
//   /** Close server & exit process */
//   server.close(() => process.exit(1))
// })