===========================================================
  Campus Marketplace – COMP2750/6750 Assignment 3
  Group Members: Sogol Hosseini, Alicia K, Aliya Ray
===========================================================

── Firebase Configuration ──────────────────────────────────

Project ID    : comp2750-a3
Auth Domain   : comp2750-a3.firebaseapp.com
API Key       : AIzaSyB0mfNZJtuwNUudgM83nX7soxlsXdwfs3A
App ID        : 1:671623399244:web:99e442a49e22d3090ff1e9
Storage Bucket: comp2750-a3.firebasestorage.app

── Test User Accounts ───────────────────────────────────────

The following accounts are set up in Firebase Authentication.
Use them to test the application:

  User 1  |  Email: user1@test.com     |  Password: Test1234!
  User 2  |  Email: user2@test.com     |  Password: Test1234!
  User 3  |  Email: user3@test.com     |  Password: Test1234!

Each user has items in Firestore under the "items" collection.
Sign in as different users to see different Available Items
and separate My Listings / My Shortlist data.

── Firestore Data Structure ─────────────────────────────────

Collection: items
  Fields:
    name        (string)  – item title
    description (string)  – short description
    price       (string)  – dollar amount or "Trade"
    category    (string)  – Textbooks | Electronics | Furniture | Clothing | Sports | Other
    imageURL    (string)  – path to image in /images folder (e.g. "images/textbook1.jpg")
                            or leave empty for a placeholder
    sellerEmail (string)  – the seller's email address
    sellerUID   (string)  – the seller's Firebase Auth UID

Collection: shortlists
  Document ID: {userId}_{itemId}   (composite key)
  Fields:
    userId   (string)  – the UID of the user who shortlisted this item
    itemId   (string)  – the Firestore document ID of the item
    addedAt  (string)  – ISO timestamp of when it was shortlisted

── How to Run ───────────────────────────────────────────────

1. Open the project folder in VS Code.
2. Install the Live Server extension (if not already installed).
3. Right-click login.html → "Open with Live Server".
4. The app will open at http://127.0.0.1:5500/login.html
5. Sign in with any of the test user credentials above.

Note: The app uses Firebase ES modules and MUST be served
over HTTP (Live Server). Opening HTML files directly via
file:// will not work due to CORS / module restrictions.

── Pages Summary ─────────────────────────────────────────────

  login.html        Sign-in page (Firebase Authentication - Alicia King)
  index.html        Welcome page – navigation hub (Sogol Hosseini)
  marketplace.html  Browse items from other users  (Sogol Hosseini)
  mylistings.html   View the signed-in user's own listings
  shortlist.html    View and manage shortlisted items

===========================================================
