const express = require('express');

// const { findOrderIdDetails } = require('../controllers/findOrderIdDetails');
const { loginUser } = require('../controllers/loginUser');
// const { buyQuestions } = require('../controllers/buyQuestions');
// const { deleteQuestionData } = require('../controllers/deleteQuestionData');
// const { updateQuestions } = require('../controllers/updateQuestions');
// const { updateUpVote } = require('../controllers/updateUpVote');
// const { verifyToken } = require('../controllers/verifyToken');
const { postUserDetails } = require('../controllers/registerUser');
// const { isPremium } = require('../controllers/isPremium');
// const { referral } = require('../controllers/referral');
// const { getReferralDetails } = require('../controllers/getReferralDetails');
// const { registerReferralUser } = require('../controllers/registerReferralUser');
// const { cheggAnswer } = require('../controllers/cheggAnswer');


const router = express.Router();

// router.get('/findOrderIdDetails', findOrderIdDetails );
router.get('/getUser', loginUser );
router.post('/postUserDetails', postUserDetails);
// router.post('/buyQuestions', buyQuestions);
// router.post('/verifyToken', verifyToken);
// router.post('/isPremium', isPremium );
// router.post('/updateQuestions', updateQuestions);
// router.delete('/deleteQuestionData', deleteQuestionData);

/** upVote routes */
// router.post('/updateUpVote', updateUpVote);

/** Referral APIs */
// router.post('/registerReferralUser', registerReferralUser);
// router.post('/referral', referral);
// router.get('/getReferralDetails', getReferralDetails);

/** Get Chegg Answer */
// router.post('/cheggAnswer', cheggAnswer);


module.exports = router;
