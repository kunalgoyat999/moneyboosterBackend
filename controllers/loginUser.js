const Users = require('../models/Users');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');

/**
 * @description get user is premium or not
 * @route GET /api/v1/userDetails/findTokenDetails
 * @access  Public
 */
 function generateToken(id) {
    const payload = { userId: id };
     console.log("id", id)

    return jwt.sign(payload, "dkjsadkjasdklj");
}
 exports.loginUser = asyncHandler(async (req, res) => {
     console.log("dsd", req.query)
     /** get data request body */
    const { 
        email,
        password
     } = req.query;

     const userDetails = await Users.find({ email, password});
     console.log("userDetails", userDetails);

    if(userDetails.length === 0) {
        res.status(400).send({
            success: false,
            message: 'No user Found',
        });
    } else {
        console.log("userDetails._id", userDetails[0]._id)
        const token = generateToken(userDetails[0]._id); 
        res.status(200).send({
            success: true,
            userDetails: userDetails[0],
            token: token
        });
    }
});
