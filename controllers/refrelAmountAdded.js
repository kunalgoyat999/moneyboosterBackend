const Users = require("../models/Users");
const asyncHandler = require("../middleware/async");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.refrelAmountAdded = asyncHandler(async (req, res) => {
  const newUser = req.body.id;
  //   const id = req.body.refered_id;
  let userDetails;
  if (mongoose.isValidObjectId(id)) {
    userDetails = await Users.find({ level1: newUser });
  }

  if (userDetails !== undefined) {
    // let level1Exist = userDetails.level1;
    let currentWithDrawAmount = userDetails.amountWithraw || 0;
    currentWithDrawAmount = parseInt(currentWithDrawAmount);
    currentWithDrawAmount += 300;
    // if (level1Exist.includes(newUser)) {
    //   return res.status(400).json({ message: "Already Exists" });
    // } else {
    await Users.findOneAndUpdate(
      { level1: newUser },
      {
        $set: {
          amountWithraw: currentWithDrawAmount.toString(),
        },
      },
      { new: true }
    );
    let userAtLevel2 = await Users.find({ level2: newUser });
    console.log("22", userAtLevel2);
    let currentWithDrawAmount2 = userAtLevel2.amountWithraw || 0;
    currentWithDrawAmount2 = parseInt(currentWithDrawAmount2);
    currentWithDrawAmount2 += 150;
    if (userAtLevel2.length !== 0) {
      await Users.findOneAndUpdate(
        { level2: newUser },
        {
          // $push: { level2: newUser }
          $set: {
            amountWithraw: currentWithDrawAmount2.toString(),
          },
        },
        { new: true }
      );
      let userAtLevel3 = await Users.find({ level3: newUser });
      console.log("33", userAtLevel3);
      let currentWithDrawAmount3 = userAtLevel3.amountWithraw || 0;
      currentWithDrawAmount3 = parseInt(currentWithDrawAmount3);
      currentWithDrawAmount3 += 50;
      if (userAtLevel3.length !== 0) {
        await Users.findOneAndUpdate(
          { level3: newUser },
          {
            //   $push: { level3: newUser }
            $set: {
              amountWithraw: currentWithDrawAmount3.toString(),
            },
          },
          { new: true }
        );
        return res.status(201).json({
          message:
            "New User added, shared user Present at another of level 1, so that added at all 3 level",
        });
      }
      return res.status(201).json({
        message:
          "New user added, shared user Present at another of level 1, but not added in all 3",
      });
    }

    //   let userLevel2Details = await Users.find({ level2: id });
    //   console.log("11", userLevel2Details);
    //   if (userLevel2Details.length !== 0) {
    //     await Users.findOneAndUpdate(
    //       { level2: id },
    //       { $push: { level3: newUser } },
    //       { new: true }
    //     );
    //     console.log("12", userLevel2Details);
    //     return res.status(201).json({
    //       message: "New User added, shared user Present at another of level 2",
    //     });
    //   }
    //   return res.status(200).json({ message: "Only present at first level" });
    // }
  } else {
    return res.status(404).json({ message: "Invalid Refrel Code" });
  }
});
