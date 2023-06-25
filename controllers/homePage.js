const Users = require('../models/Users');
const asyncHandler = require('../middleware/async');


exports.homePage = asyncHandler(async (req, res) => {

    const id = req.query.id;
     const userDetails = await Users.findById(id);

    if(userDetails.length === 0) {
        res.status(400).send({
            success: false,
            message: 'No user Found',
        });
    } else {
        res.status(200).send({
            success: true,
            userDetails: userDetails
        });
    }

})