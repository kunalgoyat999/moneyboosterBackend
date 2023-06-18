const Users = require('../models/Users');
const asyncHandler = require('../middleware/async');

/**
 * @description get user is premium or not
 * @route GET /api/v1/userDetails/findTokenDetails
 * @access  Public
 */
 exports.loginUser = asyncHandler(async (req, res) => {
     /** get data request body */
    const { 
        email,
        password
     } = req.query;

     const userDetails = await Users.find({ email, password});

    if(userDetails.length === 0) {
        res.status(400).send({
            success: false,
            message: 'No user Found',
        });
    } else {
        res.status(200).send({
            success: true,
            userDetails: userDetails[0],
        });
    }
});
