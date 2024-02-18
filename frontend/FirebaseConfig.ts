// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0kREbssZbmsu2WjhspGNaaO-vpLGdvFg",
  authDomain: "presentee-329df.firebaseapp.com",
  projectId: "presentee-329df",
  storageBucket: "presentee-329df.appspot.com",
  messagingSenderId: "555265451742",
  appId: "1:555265451742:web:c87803f84e197c3d53044f",
  measurementId: "G-M7DX96EPD5"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);