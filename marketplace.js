// import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

// store all item columns so we can re-filter without re-fetching from Firestore
let allCards = [];

// check if user is logged in - redirect to login if not
onAuthStateChanged(auth, async function(user) {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    await loadItems(user);
});

// load all items from Firestore and build the cards
async function loadItems(user) {
    const container = document.getElementById("itemsContainer");
    const loadingMsg = document.getElementById("loadingMsg");
    const emptyMsg = document.getElementById("emptyMsg");

    try {
        const snapshot = await getDocs(collection(db, "items"));

        loadingMsg.style.display = "none";

        if (snapshot.empty) {
            emptyMsg.style.display = "block";
            return;
        }

        for (const docSnap of snapshot.docs) {
            const item = docSnap.data();
            const itemId = docSnap.id;

            // skip items listed by the current user
            if (item.sellerUID === user.uid) continue;

            // check if the user has already shortlisted this item
            const shortlistRef = doc(db, "shortlists", user.uid + "_" + itemId);
            const shortlistSnap = await getDoc(shortlistRef);
            const isShortlisted = shortlistSnap.exists();

            // show "Trade" if price is empty or 0
            const priceLabel = (item.price === "Trade" || item.price === 0 || item.price === "")
                ? "Trade"
                : "$" + item.price;

            const col = document.createElement("div");
            col.className = "col-xl-3 col-lg-4 col-md-6 item-col";
            col.dataset.category = item.category || "Other";

            col.innerHTML = `
                <div class="card item-card">
                    <img
                        src="${item.imageURL || ""}"
                        class="card-img-top"
                        alt="${item.name}"
                        onerror="this.style.background='#dde3ea'; this.removeAttribute('src');"
                    />
                    <div class="card-body">
                        <span class="badge-category">${item.category || "Other"}</span>
                        <p class="item-title">${item.name}</p>
                        <p class="item-description">${item.description}</p>
                        <p class="item-price">${priceLabel}</p>
                        <p class="item-seller">Seller: ${item.sellerEmail}</p>
                        <button
                            class="btn-shortlist ${isShortlisted ? "btn-shortlisted" : ""}"
                            data-item-id="${itemId}"
                            ${isShortlisted ? "disabled" : ""}
                        >
                            ${isShortlisted ? "✓ Shortlisted" : "+ Add to Shortlist"}
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(col);
            allCards.push(col);
        }

        // if all items in Firestore belong to the current user, show empty state
        if (allCards.length === 0) {
            emptyMsg.innerHTML = `<p style="font-size:2rem;">🛒</p><p>No other listings available yet.</p>`;
            emptyMsg.style.display = "block";
            return;
        }

        container.style.display = "flex";
        addShortlistListeners(user);
        updateCount();

    } catch (err) {
        loadingMsg.innerHTML = `<p class="text-danger">Error loading items. Please refresh the page.</p>`;
        console.error(err);
    }
}

// attach click listeners to all shortlist buttons
function addShortlistListeners(user) {
    document.querySelectorAll(".btn-shortlist:not([disabled])").forEach(function(btn) {
        btn.addEventListener("click", async function() {
            const itemId = btn.dataset.itemId;

            // disable the button straight away to stop double-clicks
            btn.disabled = true;
            btn.textContent = "Saving...";

            try {
                // save to the shortlists collection using userId_itemId as the document ID
                await setDoc(doc(db, "shortlists", user.uid + "_" + itemId), {
                    userId: user.uid,
                    itemId: itemId,
                    addedAt: new Date().toISOString()
                });

                btn.textContent = "✓ Shortlisted";
                btn.className = "btn-shortlist btn-shortlisted";

            } catch (err) {
                btn.disabled = false;
                btn.textContent = "+ Add to Shortlist";
                alert("Could not save to shortlist. Please try again.");
                console.error(err);
            }
        });
    });
}

// filter items by the selected category
document.getElementById("categoryFilter").addEventListener("change", function() {
    const selected = this.value;

    allCards.forEach(function(col) {
        if (selected === "all" || col.dataset.category === selected) {
            col.style.display = "";
        } else {
            col.style.display = "none";
        }
    });

    updateCount();

    // show empty message if no cards are visible
    const visible = allCards.filter(function(c) { return c.style.display !== "none"; }).length;
    document.getElementById("emptyMsg").style.display = visible === 0 ? "block" : "none";
});

// update the item count label
function updateCount() {
    const visible = allCards.filter(function(c) { return c.style.display !== "none"; }).length;
    document.getElementById("itemCount").textContent = visible === 1 ? "1 item" : visible + " items";
}

// sign out button
document.getElementById("signOutBtn").addEventListener("click", async function() {
    await signOut(auth);
    window.location.href = "login.html";
});
