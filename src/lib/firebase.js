import * as firebase from "firebase";
import "firebase/firebase";
import "firebase/storage";
// import { getAnalytics } from "firebase/analytics";



var firebaseApp = firebase.initializeApp({
  // apiKey: "AIzaSyAY-zXO9xGAb1Q5-9BlmqeTX6Ox2B4X9UM",
  // authDomain: "fir-react-example-c9de9.firebaseapp.com",
  // databaseURL: "https://fir-react-example-c9de9.firebaseio.com",
  // projectId: "fir-react-example-c9de9",
  // storageBucket: "fir-react-example-c9de9.appspot.com",
  // messagingSenderId: "957847639161",
  // appId: "1:957847639161:web:ea5f705eff2399950570a8",
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
});

var db = firebaseApp.firestore();

// const analytics = getAnalytics();

//export const companyd = db.doc('CompanyDetails/DgCPpBU80KBoXeuztw7z');

const storage = firebase.storage();
export const coachCollection = db.collection("CoachDetails");
export const companyCollection = db.collection("CompanyDetails");
export const serviceCollection = db.collection("ServiceDetails");
export const campMultiDayCollection = db.collection("CampMultiDay");
export const campSingleDayCollection = db.collection("CampSingleDay");

export { db, storage, firebaseApp };

//Football hub:
/* 
  apiKey: "process.env.REACT_APP_FIREBASE_API_KEY",
  authDomain: "football-hub-4018a.firebaseapp.com",
  databaseURL: "https://football-hub-4018a.firebaseio.com",
  projectId: "football-hub-4018a",
  storageBucket: "football-hub-4018a.appspot.com",
  messagingSenderId: "951962857390",
  appId: "1:951962857390:web:92915655bcab77d509a23f",
  measurementId: "G-KTH71G6ZTM"
  */

//Test
/*
   apiKey: "AIzaSyAY-zXO9xGAb1Q5-9BlmqeTX6Ox2B4X9UM",
    authDomain: "fir-react-example-c9de9.firebaseapp.com",
    databaseURL: "https://fir-react-example-c9de9.firebaseio.com",
    projectId: "fir-react-example-c9de9",
    storageBucket: "fir-react-example-c9de9.appspot.com",
    messagingSenderId: "957847639161",
    appId: "1:957847639161:web:ea5f705eff2399950570a8"
    */
