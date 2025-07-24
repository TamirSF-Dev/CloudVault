import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function PdfList() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, 'pdfs'), where('userId', '==', auth.currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) =>
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return () => unsub();
  }, []);

  return (
    <div className="pdf-list">
      <h2>Your PDF Notes</h2>
      {notes.map((pdf) => (
        <div key={pdf.id}>
          <p>{pdf.name}</p>
          <a href={pdf.url} target="_blank" rel="noreferrer">View / Download</a>
        </div>
      ))}
    </div>
  );
}
