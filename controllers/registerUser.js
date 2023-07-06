const User = require("../models/Users");
const asyncHandler = require("../middleware/async");

/**
 * @description post user details
 * @route POST /api/v1/userDetails/postUserDetails
 * @access  Public
 */
exports.postUserDetails = asyncHandler(async (req, res) => {
  /** get data request body */

  /** get data from request body */
  const { name, email, phone, password, accountNo, bankName, ifscCode } =
    req.body;

    const userDetails = await User.find({email});
    let newUser;
    if(userDetails.length === 0) {
        newUser = await User.create({
            name,
            email,
            phone,
            password,
            accountNo,
            bankName,
            ifscCode,
        });
        console.log("user", newUser._id)
        res.status(201).send({
            id: newUser._id,
            success: true,
            message: 'Saved user details',
        });

    } else {
        res.status(200).send({
            success: true,
            message: 'User already registered'
        });
    }
});
