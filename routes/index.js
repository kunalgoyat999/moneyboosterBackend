const express = require('express');

const { auth } = require('../middleware/auth');
const { loginUser } = require('../controllers/loginUser');
const { postUserDetails } = require('../controllers/registerUser');
const { homePage } = require('../controllers/homePage');
const { payment } = require('../controllers/payment');
const { paymentPage } = require('../controllers/payment');
const { forgotSendOtp } = require('../controllers/forgotSendOtp');
const { refrel } = require('../controllers/refrel');
const { withDrawAmount } = require('../controllers/withDrawlAmount');
const { buyplan } = require('../controllers/buyPlan');
// withDrawAmount
const router = express.Router();

router.get('/getUser', loginUser );
router.post('/postUserDetails', postUserDetails);

router.get('/homePage', homePage);
router.post('/payment', payment);
router.post('/buyplan', buyplan);
// router.post('/payment', paymentPage);
router.post('/forgotSendOtp', forgotSendOtp);
router.post('/refrel', refrel);
router.post('/withDrawAmount', withDrawAmount);

module.exports = router;
