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
const { updateProfile } = require('../controllers/updateProfile');
const { updateBankInfo } = require('../controllers/updateBankInfo');
const { accountRecord } = require('../controllers/accountRecord');
const { refrelAmountAdded } = require('../controllers/refrelAmountAdded');
// refrelAmountAdded
const router = express.Router();

router.get('/getUser', loginUser );
router.post('/postUserDetails', postUserDetails);

router.get('/homePage', homePage);
router.post('/payment', payment);
router.post('/buyplan', buyplan);
// router.post('/payment', paymentPage);
router.post('/forgotSendOtp', forgotSendOtp);
router.post('/refrel', refrel);
router.post('/refrelAmountAdded', refrelAmountAdded);
router.post('/withDrawAmount', withDrawAmount);
router.post('/updateProfile', updateProfile);
router.post('/updateBankInfo', updateBankInfo);
router.get('/accountRecord', accountRecord);

module.exports = router;
