import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjEdQdsMev_NaMqZLQxa7v219n24HQ7zw",
  authDomain: "clone-8a143.firebaseapp.com",
  databaseURL: "https://clone-8a143.firebaseio.com",
  projectId: "clone-8a143",
  storageBucket: "clone-8a143.appspot.com",
  messagingSenderId: "399461431498",
  appId: "1:399461431498:web:d59b8427d0eaef2cb59c33",
  measurementId: "G-K6N6LS3F5L"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
// this is to avoid warnings
// db.settings({timestampsInSnapshots: true});
const auth = firebase.auth();

export { db, auth };
