# Campus Marketplace – COMP2750/6750 Assignment 3

A web application built with HTML, CSS (Bootstrap 5), JavaScript, and Firebase (Authentication + Firestore).

## Pages

| File | Description | Author |
|------|-------------|--------|
| `login.html` | Sign-in page (Firebase Authentication) | Alicia King|
| `index.html` | Welcome page – navigation hub | Sogol Hosseini |
| `marketplace.html` | Browse items from other users | Sogol Hosseini |
| `mylistings.html` | View the signed-in user's own listings | Aliya Ray |
| `shortlist.html` | View and manage shortlisted items | Aliya Ray |

## How to Run

1. Open the project folder in VS Code.
2. Install the **Live Server** extension if not already installed.
3. Right-click `login.html` → **Open with Live Server**.
4. The app opens at `http://127.0.0.1:5500/login.html`.
5. Sign in with any test user credential from `README.txt`.

> **Note:** Must be served over HTTP (Live Server). Opening via `file://` will not work due to Firebase ES module restrictions.

## Firebase Project

- **Project ID:** `comp2750-a3`
- Test user credentials and full Firestore data structure are documented in `README.txt`.
- Test credentials is user MQ email (Three test user emails are: alicia.king2@students.mq.edu.au, aliya.ray@students.mq.edu.au and 	sogol.hosseini@students.mq.edu.au) and password: Test123!
