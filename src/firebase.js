import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAJjRWPrIFTfFCu8C84lkN-JhQZYSIBMM0",
    authDomain: "clone-e5f47.firebaseapp.com",
    databaseURL: "https://clone-e5f47.firebaseio.com",
    projectId: "clone-e5f47",
    storageBucket: "clone-e5f47.appspot.com",
    messagingSenderId: "819933079636",
    appId: "1:819933079636:web:ebd60d1f03908a0e05a5c1",
    measurementId: "G-315KXJPR17"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
// this is to avoid warnings
// db.settings({timestampsInSnapshots: true});
const auth = firebase.auth();

export { db, auth };