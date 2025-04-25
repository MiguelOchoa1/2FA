import React, { useState } from 'react';
import axios from 'axios';

export function EnrollPage() {
  const [user, setUser] = useState('alice');
  const [secret, setSecret] = useState('');
  const [qrUri, setQrUri] = useState('');
  const [error, setError] = useState<string|null>(null);

  const enroll = async () => {
    console.log('👉 enroll() clicked, user=', user);
    setError(null);
    try {
      const { data } = await axios.get(`http://127.0.0.1:3000/2fa/enroll/${user}`);
      console.log('👈 enroll() response', data);
      setSecret(data.secret);
      setQrUri(data.qr_uri);
    } catch (e: any) {
      console.error('❌ enroll() failed', e);
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="page">
      <h1>Enroll</h1>
      <input
        value={user}
        onChange={e => setUser(e.target.value)}
        placeholder="username"
      />
      <button onClick={enroll}>Enroll</button>
      {error && <p className="error">Error: {error}</p>}
      {secret && (
        <div className="result">
          <p>Secret: {secret}</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUri)}`}
            alt="TOTP QR Code"
          />
        </div>
      )}
    </div>
  );
}
