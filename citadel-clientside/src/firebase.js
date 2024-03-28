// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "citadel-app-cb083.firebaseapp.com",
  projectId: "citadel-app-cb083",
  storageBucket: "citadel-app-cb083.appspot.com",
  messagingSenderId: "751188233800",
  appId: "1:751188233800:web:6505ed5547b4d85c64127d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
