// gateway/src/index.ts
import express from 'express';
import loginRouter from './login';
import enrollRouter from './enroll';
// @ts-ignore
import verifyRouter from './verify.js';
import { requireAuth, AuthRequest } from './auth';

console.log('→ index.ts loaded, about to start server');

const app = express();
const port = process.env.PORT || 3000;

// parse JSON bodies
app.use(express.json());

//
// 1) Login (username + password [+ TOTP code]) -> JWT
//
app.use('/login', loginRouter);

//
// 2) Health-check
//
app.get('/', (_req, res) => {
  res.send('2FA Auth Gateway is up and running!');
});

//
// 3) 2FA Enrollment: GET /2fa/enroll/:user_id
//
app.use('/2fa/enroll', enrollRouter);

//
// 4) 2FA Verification: POST /2fa/verify
//
app.use('/', verifyRouter);

//
// 5) Protected “profile” route (requires a valid Bearer token)
//
app.get(
  '/profile',
  requireAuth,
  (req: AuthRequest, res) => {
    res.json({
      message: `Hello ${req.user!.username}, this is your profile.`,
    });
  }
);

//
// 6) Start the server
//
app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});
