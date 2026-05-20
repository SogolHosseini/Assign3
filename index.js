// import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyB0mfNZJtuwNUudgM83nX7soxlsXdwfs3A",
    authDomain: "comp2750-a3.firebaseapp.com",
    projectId: "comp2750-a3",
    storageBucket: "comp2750-a3.firebasestorage.app",
    messagingSenderId: "671623399244",
    appId: "1:671623399244:web:99e442a49e22d3090ff1e9"
};

// start Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// check if user is logged in - redirect to login if not
onAuthStateChanged(auth, function(user) {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    // show the signed-in user's email in the welcome banner
    document.getElementById("userEmail").textContent = user.email;
});

// sign out button
document.getElementById("signOutBtn").addEventListener("click", async function() {
    await signOut(auth);
    window.location.href = "login.html";
});
