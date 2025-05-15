import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyARwOr7nPuutl4igBNn_xQbad_n6OgVUQw",
    authDomain: "food-scanner-26fe8.firebaseapp.com",
    projectId: "food-scanner-26fe8",
    storageBucket: "food-scanner-26fe8.firebasestorage.app",
    messagingSenderId: "459516294761",
    appId: "1:459516294761:web:55f052f3fe6a629d1d94f8",
    measurementId: "G-PBYV3S94EF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
