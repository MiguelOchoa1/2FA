import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ProfilePageProps {
  token: string;
}

export function ProfilePage({ token }: ProfilePageProps) {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setMsg(r.data.message))
      .catch(() => setMsg('Failed to fetch profile'));
  }, [token]);

  return (
    <div>
      <h1>Profile</h1>
      <p>{msg}</p>
    </div>
  );
}
