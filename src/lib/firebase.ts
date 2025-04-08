// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDNSym6Xl10EiDiPfIItJXYsYtHx9y0COI",
    authDomain: "dashboard-63aa1.firebaseapp.com",
    projectId: "dashboard-63aa1",
    storageBucket: "dashboard-63aa1.firebasestorage.app",
    messagingSenderId: "770566517930",
    appId: "1:770566517930:web:b600f270af79db2e9d0cd3",
    measurementId: "G-8YC1MJ671R"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
