// gateway/src/login.ts
import { Router, Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { pool } from './db';

const router = Router();
const OTP_URL = process.env.OTP_SERVICE_URL || 'http://localhost:4000';
const JWT_SECRET = process.env.JWT_SECRET!;

interface LoginBody {
  username: string;
  password: string;
  code?: string;
}

const loginHandler: RequestHandler<{}, any, LoginBody> = async (req, res) => {
  const { username, password, code } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'username and password required' });
    return;
  }

  // 1) Fetch the user’s record
  const { rows } = await pool.query<{
    password_hash: string;
    totp_secret: string;
    twofa_enabled: boolean;
  }>(
    `SELECT password_hash, totp_secret, twofa_enabled
       FROM users
      WHERE username = $1`,
    [username]
  );
  if (!rows.length) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const { password_hash, totp_secret, twofa_enabled } = rows[0];

  // 2) Verify the password
  const pwOk = await bcrypt.compare(password, password_hash);
  if (!pwOk) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  // 3) If 2FA is on, verify the TOTP code
  if (twofa_enabled) {
    if (!code) {
      res.status(400).json({ error: '2FA code required' });
      return;
    }
    const otpResp = await axios.post(`${OTP_URL}/verify`, {
      secret: totp_secret,
      code,
    });
    if (!otpResp.data.valid) {
      res.status(401).json({ error: 'Invalid 2FA code' });
      return;
    }
  }

  // 4) All good — sign & return a JWT
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
  return;
};

router.post('/', loginHandler);
export default router;
