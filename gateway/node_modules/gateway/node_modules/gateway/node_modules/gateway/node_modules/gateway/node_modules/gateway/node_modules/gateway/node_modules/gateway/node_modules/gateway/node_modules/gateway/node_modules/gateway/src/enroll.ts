// gateway/src/enroll.ts
import { Router } from 'express';
import axios from 'axios';
import { pool } from './db';

const router = Router();
const OTP_URL = process.env.OTP_SERVICE_URL || 'http://localhost:4000';

router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const otpResp = await axios.get(`${OTP_URL}/enroll`, {
      params: { user_id: userId },
    });
    const { secret, qr_uri } = otpResp.data;

    await pool.query(
      `INSERT INTO users (username, totp_secret)
       VALUES ($1, $2)
       ON CONFLICT (username) DO UPDATE
         SET totp_secret = EXCLUDED.totp_secret,
             twofa_enabled = TRUE`,
      [userId, secret]
    );

    res.json({ secret, qr_uri });
  } catch (err: any) {
    console.error('Enroll error:', err.message);
    res.status(502).json({ error: 'Failed to enroll 2FA' });
  }
});

export default router;
