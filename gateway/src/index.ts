import express from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 3000;
const OTP_URL = 'http://localhost:4000';

app.use(express.json());

// @ts-ignore
app.post('/2fa/verify', async (req, res) => {
  const { secret, code } = req.body;
  if (!secret || !code) {
    return res.status(400).json({ error: 'secret and code required' });
  }
  try {
    const otpResp = await axios.post(`${OTP_URL}/verify`, { secret, code });
    res.json(otpResp.data);
  } catch (err: any) {
    console.error('Verify error:', err.message);
    res.status(502).json({ error: 'Failed to verify 2FA code' });
  }
});

app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});
