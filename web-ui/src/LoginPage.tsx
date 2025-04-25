import React, { useState } from 'react';
import axios from 'axios';

export function LoginPage({ onToken }: { onToken: (t: string) => void }) {
  const [username, setUsername] = useState('alice');
  const [password, setPassword] = useState('password123');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string|null>(null);

  const login = async () => {
    console.log('👉 login() clicked', { username, password, code });
    setError(null);
    try {
      const { data } = await axios.post('http://127.0.0.1:3000/login', {
        username,
        password,
        code,
      });
      console.log('👈 login() response', data);
      onToken(data.token);
    } catch (e: any) {
      console.error('❌ login() failed', e);
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="page">
      <h1>Login</h1>
      <input
        placeholder="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input
        placeholder="2FA code"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button onClick={login}>Log In</button>
      {error && <p className="error">Error: {error}</p>}
    </div>
  );
}
