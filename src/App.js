import React, { useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import Upload from './components/Upload';
import PdfList from './components/PdfList';

export default function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (currUser) => setUser(currUser));

  return (
    <div className="container">
      <h1>CloudVault</h1>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={() => signOut(auth)}>Logout</button>
          <Upload />
          <PdfList />
        </>
      ) : (
        <>
          <Signup />
          <Login />
        </>
      )}
    </div>
  );
}
