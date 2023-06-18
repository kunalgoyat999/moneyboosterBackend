/** dotenv support */
require('dotenv').config();
const path = require('path');
const express = require('express');
const colors = require('colors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
// const logger = require("./logger");
const cors = require('cors');


/*** Connect to database */
connectDB()


/** load route files */
// const userDetails = require('./routes/index')

/** initilize express */
const app = express();

/** add body-parser to app.js */
app.use(
  cors({
    origin: ['https://trabko.com', 'https://workdone.trabko.com'],
  })
)

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/** Static file upload */
app.use(express.static(path.join(__dirname, '/')));

/** Mount routers */
// app.use('/api/v1/userDetails', userDetails);

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