import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAmMEWAHfDFOhkr7uWn0UvjWWVsGy-dm5c",
  authDomain: "react-instagram-clone-edf2f.firebaseapp.com",
  projectId: "react-instagram-clone-edf2f",
  storageBucket: "react-instagram-clone-edf2f.appspot.com",
  messagingSenderId: "2266628221",
  appId: "1:2266628221:web:ddd36cb056ab49e69ef114",
  measurementId: "G-SRSXNW5YJ2"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

// export default db ;