// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5FgwyJpsNBTpK6hU0TuJni0duOdULI5M",
  authDomain: "advanced-pri-norw123.firebaseapp.com",
  databaseURL: "https://advanced-pri-norw123-default-rtdb.firebaseio.com",
  projectId: "advanced-pri-norw123",
  storageBucket: "advanced-pri-norw123.firebasestorage.app",
  messagingSenderId: "772396412620",
  appId: "1:772396412620:web:9b4664b473abc075e69c69"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
