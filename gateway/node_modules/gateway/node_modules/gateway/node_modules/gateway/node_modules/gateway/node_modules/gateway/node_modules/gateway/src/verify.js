// gateway/src/verify.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const OTP_URL = process.env.OTP_SERVICE_URL || 'http://localhost:4000';

router.post('/2fa/verify', async (req, res) => {
  const { secret, code } = req.body;
  if (!secret || !code) {
    return res.status(400).json({ error: 'secret and code required' });
  }
  try {
    const otpResp = await axios.post(`${OTP_URL}/verify`, { secret, code });
    return res.json(otpResp.data);
  } catch (err) {
    console.error('Verify error:', err.message);
    return res.status(502).json({ error: 'Failed to verify 2FA code' });
  }
});

module.exports = router;
