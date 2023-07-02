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
var crypto = require("crypto");


/*** Connect to database */
connectDB()


/** load route files */
const userDetails = require('./routes/index')

/** initilize express */
const app = express();

/** add body-parser to app.js */
// app.use(
//   cors({
//     origin: ['https://trabko.com', 'https://workdone.trabko.com'],
//   })
// )
app.use(cors());


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
  console.log("heree")
  // let ord = "ORD" + uniqid();
  res.render(__dirname + "/checkout1.html", { orderid: ord, key: key });
});

// 0j7zny|ORDcz19klavmljldl13y|1|P01,P02|Kunal|kunal.groobizz@gmail.com|none||||PayUBiz_NODE_JS_KIT||||||0bEORCg1
// 0j7zny|ORDcz19klay7ljldnj3y|50|asdasd|Kunal|kunal.groobizz@gmail.com|none|88888|||PayUBiz_NODE_JS_KIT||||||0bEORCg1
app.post("/pay", function (req, res) {

  console.log("heeeedssdsdsas", req.body)
  var strdat = "";

  req.on("data", function (chunk) {
    strdat += chunk;
  });
  req.on("end", function () {
    var data = JSON.parse(strdat);

    //generate hash with mandatory parameters and udf5
    var cryp = crypto.createHash("sha512");
    console.log("data", data)

    // "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
    var text =
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
    var hash = cryp.digest("hex");
    res.end(JSON.stringify(hash));
  });
}); 

app.post("/response.html", async function (req, res) {
  console.log("resquest", req.body)
  var verified = "No";
  var txnid = req.body.txnid;
  var amount = req.body.amount;
  var productinfo = req.body.productinfo;
  var firstname = req.body.firstname;
  var email = req.body.email;
  var udf1 = req.body.udf1; // referral by
  var udf2 = req.body.udf2; // number of questions
  var udf5 = req.body.udf5;
  var mihpayid = req.body.mihpayid;
  var status = req.body.status;
  var resphash = req.body.hash;
  var txnDate = req.body.addedon;
  var mode = req.body.mode;
  var state = req.body.state;
  var additionalcharges = "";

  //Calculate response hash to verify
  var keyString =
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

  var keyArray = keyString.split("|");
  var reverseKeyArray = keyArray.reverse();
  var reverseKeyString = salt + "|" + status + "|" + reverseKeyArray.join("|");
  //check for presence of additionalcharges parameter in response.
  if (typeof req.body.additionalCharges !== "undefined") {
    additionalcharges = req.body.additionalCharges;
    //hash with additionalcharges
    reverseKeyString = additionalcharges + "|" + reverseKeyString;
  }

  //Generate Hash
  var cryp = crypto.createHash("sha512");
  cryp.update(reverseKeyString);
  var calchash = cryp.digest("hex");
  var msg =
    "Payment failed for Hash not verified...<br />Check Console Log for full response...";
  //Comapre status and hash. Hash verification is mandatory.
  if (calchash == resphash) {
    msg =
      "Transaction Successful and Hash Verified...<br />Check Console Log for full response...";
  }



  //Verify Payment routine to double check payment
  var command = "verify_payment";

  var hash_str = key + "|" + command + "|" + txnid + "|" + salt;
  var vcryp = crypto.createHash("sha512");
  vcryp.update(hash_str);
  var vhash = vcryp.digest("hex");

  var options = {
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

  // await request(options, (error, res, body) => {
  //   if (error) {
  //     loggerMongoDB.error(`pay40 -- request failed to stripe dashboard -- error -- ${error} -- `)
  //     return console.error("upload failed:", error);
  //   }

  //   if (res.statusCode == 200) {
  //     return (isTrue = true);
  //   }
  // });

  if (status === "success") {
    let str = resphash;
    const token = str.substring(0, 40);

    let questions = 0;
    if (amount == 50 || amount == 500 || amount == 5000)  {
      questions = 12;
    } else if (amount == 100 || amount == 1000 || amount == 10000) {
      questions = 30;
    } else if (amount == 200 || amount == 2000 || amount == 20000) {
      questions = 70;
    } else if (amount == 400 || amount == 4000 || amount == 40000) {
      questions = 150;
    }

    // await fetch(`${config.production.baseUrl}/buyQuestions`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     TXNID: token,
    //     emailTransactionID: txnid,
    //     TXNAMOUNT: amount,
    //     PAYMENTMODE: mode,
    //     TXNDATE: txnDate,
    //     QUESTIONS: questions,
    //   }),
    // });

    // await fetch(`${config.production.baseUrl}/postUserDetails`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: firstname,
    //     email,
    //     state,
    //     detailsFrom: 'PayU'
    //   }),
    // });

    // await fetch(`${config.production.baseUrl}/referral`, {
    //   method: "post",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     referralBy: udf1,
    //     questions,
    //     orderId: txnid
    //   }),
    // });

    // setTimeout( async () => {
    //   if (isTrue) {
        // loggerSuccessTrafficAt40page.info(`successTraffic -- name = ${firstname} -- email = ${email} -- token = ${token}`);

        // await fetch(`${config.production.baseUrl}/buyQuestions`, {
        //   method: "post",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     TXNID: token,
        //     emailTransactionID: txnid,
        //     TXNAMOUNT: amount,
        //     PAYMENTMODE: mode,
        //     TXNDATE: txnDate,
        //     QUESTIONS: questions,
        //   }),
        // });

        return res.send(`payment success`);
      // }
    // }, 2000);
  } else {
    // loggerLocalError.info(`pay40 -- Payment Failed -- txnid = ${txnid} -- amount = ${amount} -- email = ${email} -- mode = ${mode} -- state = ${state} -- resphash = ${resphash} -- calchash = ${calchash} -- key = ${key} -- command = ${command} -- `);
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