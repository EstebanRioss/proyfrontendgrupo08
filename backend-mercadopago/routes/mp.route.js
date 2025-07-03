const express = require('express');
const router = express.Router();
const mpCtrl = require('../controllers/mp.controller');
router.post('/get-payment-link', mpCtrl.getPaymentlink);
router.post('/buy-ticket', mpCtrl.buyTicket);
router.post('/receive-webhook', mpCtrl.receiveWebhook);
module.exports = router;