const User = require("../models/Users");
const asyncHandler = require("../middleware/async");

/**
 * @description post user details
 * @route POST /api/v1/userDetails/postUserDetails
 * @access  Public
 */
exports.accountRecord = asyncHandler(async (req, res) => {
  /** get data request body */

  /** get data from request body */
  const {id, ifsc_code, account_number, bankName} = req.body;

  const user = req.query.id;
  const level = req.query.level;

  let userDetails = await User.findById(user);
  if(userDetails !== undefined) {
    if(userDetails.accountRecord !== undefined) {
      if(level == 1) {
        return res.status(200).send({results: userDetails.accountRecord})
      } else if(level == 2) {
        let arr = userDetails.accountRecord;
        let newArr = []
        for(let i=0; i<arr.length; i++){
          if(arr[i].type == "Withdraw"){
            newArr.push(arr[i])
          }
        }
        return res.status(200).send({results: newArr})
      }
      else if(level == 3) {
        let arr = userDetails.accountRecord;
        let newArr = []
        for(let i=0; i<arr.length; i++){
          if(arr[i].type == "Recharge"){
            newArr.push(arr[i])
          }
        }
        return res.status(200).send({results: newArr})
      }
     
    } else {
      return res.status(400).json({message: "Account not found"})
    }
  }
});
