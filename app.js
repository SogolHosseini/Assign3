// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where }
    from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const db = getFirestore(app);


// Login.html
const signInButton = document.getElementById("signInButton");

if (signInButton) {
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const messageArea = document.getElementById("messageArea");

    signInButton.addEventListener("click", async function () {
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            messageArea.textContent = "Welcome, " + user.email + "! Redirecting...";
            messageArea.style.color = "green";

            setTimeout(function () {
                window.location.href = "index.html";
            }, 2000);

        } catch (error) {
            messageArea.textContent = "Sign in failed. Please check your email and password.";
            messageArea.style.color = "red";
        }
    });
}


// Index.html
const itemsContainer = document.getElementById("itemsContainer");

if (itemsContainer) {

    const signOutButton = document.getElementById("signOutButton");
    const userEmail = document.getElementById("userEmail");
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");
    const categoryFilter = document.getElementById("categoryFilter");
    const itemCount = document.getElementById("itemCount");

    let allItems = [];

onAuthStateChanged(auth, function (user) {
    if (user) {
        if (userEmail) userEmail.textContent = user.email;  
        loadListings();
    } else {
        window.location.href = "login.html";
    }
});

    signOutButton.addEventListener("click", async function () {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Sign out failed:", error);
            alert("Sign out failed. Please try again.");
        }
    });

    categoryFilter.addEventListener("change", function () {
        const selected = categoryFilter.value;
        const filtered = selected === "all"
            ? allItems
            : allItems.filter(item => item.listing_category === selected);
        renderItems(filtered);
    });

    // Fetch listings from Firestore
    async function loadListings() {
        const snapshot = await getDocs(collection(db, "Listings"));
        allItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems(allItems);
    }

    function renderItems(items) {
        loadingMsg.style.display = "none";

        if (items.length === 0) {
            itemsContainer.style.display = "none";
            emptyMsg.style.display = "block";
            itemCount.textContent = "";
            return;
        }

        emptyMsg.style.display = "none";
        itemsContainer.style.display = "flex";
        itemCount.textContent = items.length + " item(s) found";

        itemsContainer.innerHTML = items.map(item => `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img src= "${item.listing_image}" class="card-img-top" alt="${item.listing_title}" />
                    <div class="card-body">
                        <h5 class="card-title">${item.listing_title}</h5>
                        <p class="card-text text-muted">${item.listing_category}</p>
                        <p class="card-text">${item.listing_price}</p>
                        <p class="card-text">${item.listing_availability ? "Available" : "Not available"}</p>
                        <p class="card-text"><small>${item.listing_description}</small></p>
                        <p class="card-text"><small>Condition: ${item.listing_condition}</small></p>
                        <p class="card-text"><small>Listed by: ${item.listing_owner}</small></p>
                    </div>
                </div>
            </div>
        `).join("");
            }

}
//  mylistings.html
const myListingsContainer = document.getElementById("myListingsContainer");

if (myListingsContainer) {

    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");

    onAuthStateChanged(auth, function (user) {

        if (!user) {
            window.location.href = "login.html";
            return;
        }

        loadMyListings(user);
    });

    async function loadMyListings(user) {

        const snapshot = await getDocs(collection(db, "Listings"));

        const allItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const myItems = allItems.filter(item =>
            item.listing_owner === user.email
        );

        renderMyListings(myItems);
    }

    function renderMyListings(items) {

        loadingMsg.style.display = "none";

        if (items.length === 0) {
            emptyMsg.style.display = "block";
            myListingsContainer.style.display = "none";
            return;
        }

        emptyMsg.style.display = "none";
        myListingsContainer.style.display = "flex";

        myListingsContainer.innerHTML = items.map(item => `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img src="${item.listing_image}" class="card-img-top" />
                    <div class="card-body">
                        <h5 class="card-title">${item.listing_title}</h5>
                        <p class="card-text text-muted">${item.listing_category}</p>
                        <p class="card-text"> <small>Price: ${item.listing_price}</small> </p>
                        <p class="card-text">${item.listing_availability ? "Available" : "Not available"}</p>
                        <p class="card-text"> <small>Description: ${item.listing_description}</small> </p
                        <p class="card-text"> <small>Condition: ${item.listing_condition}</small> </p>
                    </div>
                </div>
            </div>
        `).join("");
    }
}

// shortlist.html
const myShortlistContainer = document.getElementById("myShortlistContainer");

if (myShortlistContainer){
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");

    onAuthStateChanged(auth, function (user){
        if(user){
            loadShortlist(user);
        } else {
            window.location.href = "login.html";
        }
    });
    async function loadShortlist(user){
        const shortlistQuery = query(
            collection(db, "Shortlist"),
            where("userId", "==", user.email)
        );
        const shortlistSnapshot =await getDocs(shortlistQuery);
        const listingsSnapshot = await getDocs(collection(db, "Listings"));
        const allListings = listingsSnapshot.docs.map(doc=> ({
            id: doc.id,
            ...doc.data()
        }));

        const shortlistItems = [];
        shortlistSnapshot.forEach(function (docSnapshot){
            const shortlist = docSnapshot.data();
            const matchingListing = allListings.find(
                listing=>listing.id === shortlist.listingId
            );
            if (matchingListing){
                shortlistItems.push({
                    shortlistId: docSnapshot.id,
                    ...matchingListing
                });
            }
        });
        renderShortlist(shortlistItems);
    }
function renderShortlist(items) {
    loadingMsg.style.display="none";
    if (items.length===0) {
        emptyMsg.style.display ="block";
        myShortlistContainer.style.display = "none";
        return;
    }
    emptyMsg.style.display = "none";
    myShortlistContainer.style.display = "flex";

    myShortlistContainer.innerHTML = items.map(item =>`
        <div class="col-sm-6 col-md-4 col-lg-3">
            <div class ="card h-100 shadow-sm">
                <img src="${item.listing_image}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">
                        ${item.listing_title}</h5>
                    <p class="card-text">
                        ${item.listing_price}</p>
                    <button 
                        class="btn btn-danger btn-sm remove-btn"
                        data-id="${item.shortlistId}">
                    Remove </button>
                </div>
            </div>
        </div>      
        `).join("");
        attachRemoveHandlers();
}
function attachRemoveHandlers(){
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(function (button) {
        button.addEventListener("click", async function (){
            const shortlistId = button.getAttribute("data-id");
            await deleteDoc(doc(db, "Shortlist", shortlistId));
        loadShortlist(auth.currentUser);
    });
});
}
}
