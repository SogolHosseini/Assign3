// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where }
    from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Config
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


// ALL PAGES

const signOutButton = document.getElementById("signOutButton");
const userEmail = document.getElementById("userEmail");
const itemsContainer = document.getElementById("itemsContainer");
const myListingsContainer = document.getElementById("myListingsContainer");
const myShortlistContainer = document.getElementById("myShortlistContainer");

let allItems = [];
let allShortlistedIds = [];
let currentUser = null;

onAuthStateChanged(auth, function (user) {
    if (user) {

        currentUser = user;
        if (userEmail) userEmail.textContent = user.email;
        if (itemsContainer) loadListings(user);
        if (myListingsContainer) loadMyListings(user);
        if (myShortlistContainer) loadShortlist(user);
    } else {
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = "login.html";
        }
    }
});

if (signOutButton) {
    signOutButton.addEventListener("click", async function () {
        try {
            await signOut(auth);
            window.location.href = "login.html";
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    });
}


// login.html

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


// marketplace.html

if (itemsContainer) {
    const categoryFilter = document.getElementById("categoryFilter");

    categoryFilter.addEventListener("change", function () {
        const selected = categoryFilter.value;
        const filtered = selected === "all"
            ? allItems
            : allItems.filter(item => item.listing_category === selected);
        renderItems(filtered, allShortlistedIds, currentUser);
    });
}

async function loadListings(user) {
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");
    const itemCount = document.getElementById("itemCount");

    const snapshot = await getDocs(collection(db, "Listings"));
    const shortlistSnapshot = await getDocs(
        query(collection(db, "Shortlist"), where("userId", "==", user.email))
    );

    allShortlistedIds = [];
    shortlistSnapshot.forEach(docSnap => {
        allShortlistedIds.push(docSnap.data().listingId);
    });

    allItems = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.listing_owner !== user.email);

    renderItems(allItems, allShortlistedIds, user);
}

function renderItems(items, shortlistedIds, user){
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");
    const itemCount = document.getElementById("itemCount");
    
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

    itemsContainer.innerHTML = items.map(item => {
        const alreadyShortlisted = shortlistedIds.includes(item.id);
        return `
            <div class="col-sm-6 col-md-4 col-lg-3">
                <div class="card h-100 shadow-sm">
                    <img src="${item.listing_image}" class="card-img-top" />
                    <div class="card-body">
                        <h5 class="card-title">${item.listing_title}</h5>
                        <p class="card-text text-muted">${item.listing_category}</p>
                        <p class="card-text">${item.listing_price}</p>
                        <p class="card-text"><small>${item.listing_description}</small></p>
                        <p class="card-text"><small>Condition: ${item.listing_condition}</small></p>
                        <p class="card-text"><small>Listed by: ${item.listing_owner}</small></p>
                        <button
                            class="btn ${alreadyShortlisted ? "btn-success" : "btn-primary"} shortlist-btn"
                            data-id="${item.id}" ${alreadyShortlisted ? "disabled" : ""}>
                            ${alreadyShortlisted ? "Shortlisted" : "Add to Shortlist"}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    attachShortlistHandlers(user);
}

function attachShortlistHandlers(user) {
    document.querySelectorAll(".shortlist-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const listingId = button.getAttribute("data-id");
            await addDoc(collection(db, "Shortlist"), {
                userId: user.email,
                listingId: listingId
            });
            loadListings(user);
        });
    });
}


// mylistings.html

async function loadMyListings(user) {
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");

    const snapshot = await getDocs(collection(db, "Listings"));

    const myItems = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(item => item.listing_owner === user.email);

    loadingMsg.style.display = "none";

    if (myItems.length === 0) {
        emptyMsg.style.display = "block";
        myListingsContainer.style.display = "none";
        return;
    }

    emptyMsg.style.display = "none";
    myListingsContainer.style.display = "flex";

    myListingsContainer.innerHTML = myItems.map(item => `
        <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm">
                <img src="${item.listing_image}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">${item.listing_title}</h5>
                    <p class="card-text text-muted">${item.listing_category}</p>
                    <p class="card-text"><small>Price: ${item.listing_price}</small></p>
                    <p class="card-text"><small>Description: ${item.listing_description}</small></p>
                    <p class="card-text"><small>Condition: ${item.listing_condition}</small></p>
                </div>
            </div>
        </div>
    `).join("");
}


// shortlist.html

async function loadShortlist(user) {
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");

    const shortlistSnapshot = await getDocs(
        query(collection(db, "Shortlist"), where("userId", "==", user.email))
    );
    const listingsSnapshot = await getDocs(collection(db, "Listings"));

    const allListings = listingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const shortlistItems = [];
    shortlistSnapshot.forEach(docSnapshot => {
        const matchingListing = allListings.find(
            listing => listing.id === docSnapshot.data().listingId
        );
        if (matchingListing) {
            shortlistItems.push({
                shortlistId: docSnapshot.id,
                ...matchingListing
            });
        }
    });

    loadingMsg.style.display = "none";

    if (shortlistItems.length === 0) {
        emptyMsg.style.display = "block";
        myShortlistContainer.style.display = "none";
        return;
    }

    emptyMsg.style.display = "none";
    myShortlistContainer.style.display = "flex";

    myShortlistContainer.innerHTML = shortlistItems.map(item => `
        <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card h-100 shadow-sm">
                <img src="${item.listing_image}" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">${item.listing_title}</h5>
                    <p class="card-text">${item.listing_price}</p>
                    <button
                        class="btn btn-danger btn-sm remove-btn"
                        data-id="${item.shortlistId}">
                        Remove
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    attachRemoveHandlers(user);
}

function attachRemoveHandlers(user) {
    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", async function () {
            const shortlistId = button.getAttribute("data-id");
            await deleteDoc(doc(db, "Shortlist", shortlistId));
            loadShortlist(user);
        });
    });
}

