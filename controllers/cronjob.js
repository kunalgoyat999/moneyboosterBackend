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
    if (users.length > 0) {
      for (const user of users) {
        let value1 = 0;
        let value2 = 0;
        let value3 = 0;
        let value4 = 0;
        let value5 = 0;
        let amountAdded = user.amountWithraw || 0;
        let amt = 0;
        let incomeAMT = 0;
        if (user.plans && user.plans.plan1 !== undefined) {
            console.log("value1", value1)

          value1 += user.plans.plan1;
          

          amt = 110 * value1;
          incomeAMT += 110 * value1;

          amountAdded += amt;
          console.log("amountAdded1", amountAdded);
        }
        if (user.plans && user.plans.plan2 !== undefined) {
          value2 += user.plans.plan2;

          amt = 430 * value2;
          incomeAMT += 430 * value1;

          amountAdded += amt;
          console.log("amountAdded2", amountAdded);
        }
        if (user.plans && user.plans.plan3 !== undefined) {
          value3 += user.plans.plan3;

          amt = 1313 * value3;
          incomeAMT += 1313 * value1;

          amountAdded += amt;
          console.log("amountAdded3", amountAdded);
        }
        if (user.plans && user.plans.plan4 !== undefined) {
          value4 += user.plans.plan4;

          amt = 4029 * value4;
          incomeAMT += 4029 * value1;

          amountAdded += amt;
          console.log("amountAdded4", amountAdded);
        }
        if (user.plans && user.plans.plan5 !== undefined) {
            value5 += user.plans.plan5;
  
            amt = 8375 * value5;
            incomeAMT += 8375 * value5;
  
            amountAdded += amt;
            console.log("amountAdded5", amountAdded);
          }
        const currentDate = new Date();
        let recharge = {
          type: "Income",
          date: currentDate,
          amount: incomeAMT,
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
    console.log("API call successful:", users);
  } catch (error) {
    console.error("API call failed:", error.message);
  }
  // }
};

// Schedule the task to run every hour
cron.schedule(cronSchedule, handleNewHour);
