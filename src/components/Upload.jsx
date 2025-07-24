import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from '../firebase';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function Upload() {
  const [pdf, setPdf] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!pdf) return;

    setUploading(true);
    const storageRef = ref(storage, `pdfs/${auth.currentUser.uid}/${pdf.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pdf);

    uploadTask.on('state_changed',
      null,
      (error) => {
        alert(error.message);
        setUploading(false);
      },
      async () => {
        try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await addDoc(
        collection(db, "pdfs"), // correct nested path
        {
            userId: auth.currentUser.uid,
            name: pdf.name,
            url: downloadURL,
            uploadedAt: serverTimestamp(),
        }
        );
        alert("Upload complete");
        setPdf(null);
        } catch (err) {
        console.error("Firestore write error:", err);
        alert("Failed to save metadata.");
        } finally {
        setUploading(false);
        }
    }
    );
     
  };

  return (
    <div className="container">
      <h2>Upload Your PDF</h2>
      <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload PDF"}
      </button>
    </div>
  );
}

export default Upload;
