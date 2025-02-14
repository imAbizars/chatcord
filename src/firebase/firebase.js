// Import modular Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA7o85dulq8J3plAMa1r-qqEfFzky7-kJ0",
    authDomain: "chatcord-9195e.firebaseapp.com",
    projectId: "chatcord-9195e",
    storageBucket: "chatcord-9195e.firebasestorage.app",
    messagingSenderId: "433708997803",
    appId: "1:433708997803:web:36af2e9974a3f232b3ebee"
};

// Inisialisasi Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
