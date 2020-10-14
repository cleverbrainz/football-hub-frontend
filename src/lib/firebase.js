import * as firebase from "firebase";
import "firebase/firebase";
import "firebase/storage";

var firebaseApp = firebase.initializeApp({
  // apiKey: "AIzaSyAY-zXO9xGAb1Q5-9BlmqeTX6Ox2B4X9UM",
  // authDomain: "fir-react-example-c9de9.firebaseapp.com",
  // databaseURL: "https://fir-react-example-c9de9.firebaseio.com",
  // projectId: "fir-react-example-c9de9",
  // storageBucket: "fir-react-example-c9de9.appspot.com",
  // messagingSenderId: "957847639161",
  // appId: "1:957847639161:web:ea5f705eff2399950570a8",
  apiKey: 'AIzaSyBQvA7TWls9pSSZKL0aKdBt4cabvGPl0zI',
  authDomain: 'football-hub-4018a.firebaseapp.com',
  databaseURL: 'https://football-hub-4018a.firebaseio.com',
  projectId: 'football-hub-4018a',
  storageBucket: 'football-hub-4018a.appspot.com',
  messagingSenderId: '951962857390',
  appId: '1:951962857390:web:92915655bcab77d509a23f',
  measurementId: 'G-KTH71G6ZTM'
});

var db = firebaseApp.firestore();

//export const companyd = db.doc('CompanyDetails/DgCPpBU80KBoXeuztw7z');

const storage = firebase.storage();
export const coachCollection = db.collection("CoachDetails");
export const companyCollection = db.collection("CompanyDetails");
export const serviceCollection = db.collection("ServiceDetails");
export const campMultiDayCollection = db.collection("CampMultiDay");
export const campSingleDayCollection = db.collection("CampSingleDay");

export { db, storage };

//Football hub:
/* 
  apiKey: "AIzaSyBQvA7TWls9pSSZKL0aKdBt4cabvGPl0zI",
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
