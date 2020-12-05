import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "****REMOVED****",
  authDomain: "****REMOVED****",
  databaseURL: "****REMOVED****",
  projectId: "****REMOVED****",
  storageBucket: "clone-e5f47.appspot.com",
  messagingSenderId: "****REMOVED****",
  appId: "****REMOVED****",
  measurementId: "****REMOVED****"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
// this is to avoid warnings
// db.settings({timestampsInSnapshots: true});
const auth = firebase.auth();

export { db, auth };
