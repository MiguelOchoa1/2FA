import express from 'express';
import enrollRouter from './enroll';

// @ts-ignore
import verifyRouter from './verify.js';


console.log('→ index.ts loaded, about to start server');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health‑check
app.get('/', (_req, res) => {
  res.send('2FA Auth Gateway is up and running!');
});

// Mount our routers
app.use('/2fa/enroll', enrollRouter);
app.use('/', verifyRouter);

// Start the server
app.listen(port, () => {
  console.log(`API Gateway listening on http://localhost:${port}`);
});
