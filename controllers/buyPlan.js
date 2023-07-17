const Users = require("../models/Users");
const asyncHandler = require("../middleware/async");


exports.buyplan = asyncHandler(async (req, res) => {
  const amount = req.body.amount;
  const planNo = req.body.planNo;
  const user = req.query.id;

  let userDetails = await Users.findById(user);

  if (
    userDetails.amountToBeUse !== undefined &&
    userDetails.amountToBeUse >= amount
  ) {
    let updatedAmount = userDetails.amountToBeUse - amount;
    userDetails = await Users.findOneAndUpdate(
      { _id: user },
      {
        $set: {
          amountToBeUse: updatedAmount,
        },
      },
      { new: true }
    );
    let planUpdate = {};

    if (planNo == 1) {
      planUpdate = { $inc: { "plans.plan1": 1 } };
    } else if (planNo == 2) {
      planUpdate = { $inc: { "plans.plan2": 1 } };
    } else if (planNo == 3) {
      planUpdate = { $inc: { "plans.plan3": 1 } };
    } else if (planNo == 4) {
      planUpdate = { $inc: { "plans.plan4": 1 } };
    }

    userDetails = await Users.findOneAndUpdate({ _id: user }, planUpdate, {
      new: true,
    });
    return res.status(200).json({ message: "Recharge Done" });
  }
  console.log("req", userDetails);
  return res.status(200).json({ message: "Something went wrong" });
});
