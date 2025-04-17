import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import {db, storage} from './firebase'
import firebase from "firebase"
import './ImageUpload.css'

function ImageUpload( {username}) {
  const [image, setImage] = useState(null)
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('')

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0])
    } 
  }

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        setProgress(progress)
      },
      (error) => {
        // error function ...
        console.log(error)
        alert(error.message)
      },
      () => {
        // complete function ...
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });

            setProgress(0);
            setImage(null);
            setCaption('');
          })
      }
    )
  }

  return (
    <div className="imageupload">
      {/* Image Uploader */}
      {/* progress bar */}
      {/* caption input field */}
      {/* file picker */}
      {/* Post (Upload) button */}

      <progress className="imageupload__progress" value={progress} max="100" />
      <input type="text" placeholder="Enter a caption..." value={caption} onChange={event => setCaption(event.target.value)} />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload} >
        Upload
      </Button>
    </div>
  )
}

export default ImageUpload
