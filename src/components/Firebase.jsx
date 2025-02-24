// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4I1XHWk869ygZQfQfUxvuqTKl3O-Nyzg",
  authDomain: "ecom-4ddd5.firebaseapp.com",
  projectId: "ecom-4ddd5",
  storageBucket: "ecom-4ddd5.firebasestorage.app",
  messagingSenderId: "159619664377",
  appId: "1:159619664377:web:124eec629db12b57dc1528",
  measurementId: "G-J1RN2HZNFG",
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


export { auth };