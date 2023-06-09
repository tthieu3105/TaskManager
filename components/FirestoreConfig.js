import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
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


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);