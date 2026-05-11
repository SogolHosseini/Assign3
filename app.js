// Import Firebase Tools 
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword }
    from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

// Config from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB0mfNZJtuwNUudgM83nX7soxlsXdwfs3A",
  authDomain: "comp2750-a3.firebaseapp.com",
  projectId: "comp2750-a3",
  storageBucket: "comp2750-a3.firebasestorage.app",
  messagingSenderId: "671623399244",
  appId: "1:671623399244:web:99e442a49e22d3090ff1e9",
  measurementId: "G-6L51SFGBTD"
};

// Start Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Grab your HTML elements
// const emailInput = document.getElementById("___");
// const passwordInput = document.getElementById("___");
// const signInButton = document.getElementById("___");
// const messageArea = document.getElementById("___");

// Sign in when the button is clicked
signInButton.addEventListener("click", async function () {

    // get what the user typed in
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // sign in worked - show a message then redirect
        messageArea.textContent = "Welcome, " + user.email + "! Redirecting...";
        messageArea.style.color = "green";

        setTimeout(function () {
            window.location.href = "index.html";
        }, 2000);

    } catch (error) {
        // sign in failed - tell the user
        messageArea.textContent = "Sign in failed. Please check your email and password.";
        messageArea.style.color = "red";
    }
});
