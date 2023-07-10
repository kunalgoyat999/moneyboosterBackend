const User = require("../models/Users");
const asyncHandler = require("../middleware/async");

/**
 * @description post user details
 * @route POST /api/v1/userDetails/postUserDetails
 * @access  Public
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  /** get data request body */

  /** get data from request body */
  const {id, name, email, phone, bankNme="sdds"} = req.body;
  console.log("req", req.body)

    const userDetails = await User.findById(id);
    let newUser;
    if(userDetails.length !== 0) {
        newUser = await User.findOneAndUpdate(
            { _id: id },
            {
              $set: {
                name: name,
                email: email,
                phone: phone,
                bankName: bankNme
              }
            },
            { new: true });
        console.log("user", newUser)
        res.status(201).send({
            id: newUser._id,
            success: true,
            message: 'User updated Successfully',
        });

    } else {
        res.status(400).send({
            success: false,
            message: 'Something went wrong'
        });
    }
});
