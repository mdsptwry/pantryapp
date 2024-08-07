// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLbolCFKmTqlKZHiu41B_JDZaRDn-WOVc",
  authDomain: "hspantryapp-a993d.firebaseapp.com",
  projectId: "hspantryapp-a993d",
  storageBucket: "hspantryapp-a993d.appspot.com",
  messagingSenderId: "670156011360",
  appId: "1:670156011360:web:1a7a611d692524085bd005"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}