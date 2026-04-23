import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = { 
  apiKey: "AIzaSyAUO92SOCg5WvTTg15xypDDFayqUXWoqUc", 
  authDomain: "vipercell-8502b.firebaseapp.com", 
  projectId: "vipercell-8502b", 
  storageBucket: "vipercell-8502b.firebasestorage.app", 
  messagingSenderId: "509296616890", 
  appId: "1:509296616890:web:57e7521494db9c52942983" 
};

export const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app); 
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();
