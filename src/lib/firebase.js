import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcRgxzA0DvlsQUSjz_8SUR-wDKmCQYMlU",
  authDomain: "my-chart-app-a6f67.firebaseapp.com",
  projectId: "my-chart-app-a6f67",
  storageBucket: "my-chart-app-a6f67.firebasestorage.app",
  messagingSenderId: "657729241412",
  appId: "1:657729241412:web:70b0ff7e18000ffe081711"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);