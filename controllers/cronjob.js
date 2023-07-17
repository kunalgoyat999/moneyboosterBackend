const Users = require("../models/Users");
const asyncHandler = require("../middleware/async");
const cron = require("node-cron");
const axios = require("axios");

const cronSchedule = '*/10 * * * * *';
// const cronSchedule = "0 0 * * *";

// Function to be executed every hour
const handleNewHour = async () => {
  console.log("hee")
  try {
    const users = await Users.find({ plans: { $exists: true } }).exec();
    let value1 = 0;
    let value2 = 0;
    let value3 = 0;
    let value4 = 0;
    if (users.length > 0) {
      for (const user of users) {
        let amountAdded = user.amountWithraw || 0;
        let amt = 0;
        if (user.plans && user.plans.plan1 !== undefined) {
          value1 += user.plans.plan1;

          amt = 100 * value1;
          amountAdded += amt;
          console.log("amountAdded", amountAdded);
        }
        if (user.plans && user.plans.plan2 !== undefined) {
          value2 += user.plans.plan2;

          amt = 200 * value2;
          amountAdded += amt;
          console.log("amountAdded", amountAdded);
        }
        if (user.plans && user.plans.plan3 !== undefined) {
          value3 += user.plans.plan3;

          amt = 300 * value3;
          amountAdded += amt;
        }
        if (user.plans && user.plans.plan4 !== undefined) {
          value4 += user.plans.plan4;

          amt = 400 * value4;
          amountAdded += amt;
        }
        let recharge = {
          type: "Income",
          date: currentDate,
          amount: amountAdded,
        };
        await Users.findOneAndUpdate(
          { _id: user._id },
          {
            $set: {
              amountWithraw: amountAdded,
            },
            $push: { accountRecord: recharge },
          },
          { new: true }
        );
      }
    }
    console.log("API call successful:", users, value1, value2, value3, value4);
  } catch (error) {
    console.error("API call failed:", error.message);
  }
  // }
};

// Schedule the task to run every hour
cron.schedule(cronSchedule, handleNewHour);
