// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCZAfYoU51Tz_sP33uN6mCFCNA81hQ_Mg",
  authDomain: "mobileproject-ca4c1.firebaseapp.com",
  databaseURL: "https://mobileproject-ca4c1-default-rtdb.firebaseio.com",
  projectId: "mobileproject-ca4c1",
  storageBucket: "mobileproject-ca4c1.appspot.com",
  messagingSenderId: "1037634621405",
  appId: "1:1037634621405:web:92aa1cd29ca398e5eb7034",
  measurementId: "G-JHPL6CCKK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getDatabase(app);