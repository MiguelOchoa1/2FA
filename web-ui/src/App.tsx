// web-ui/src/App.tsx
import { useState } from 'react';
import { EnrollPage } from './EnrollPage';
import { LoginPage } from './LoginPage';
import { ProfilePage } from './ProfilePage';

export default function App() {
  const [token, setToken] = useState<string | null>(null);

  if (token) {
    return <ProfilePage token={token} />;
  }

  return (
    <>
      <EnrollPage />
      <hr />
      <LoginPage onToken={t => setToken(t)} />
    </>
  );
}
