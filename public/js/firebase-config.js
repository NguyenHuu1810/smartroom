import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getDatabase } from
  "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCioxJ8v9x22UNrWVzNRXcCMrfAIkXzFAk",
  authDomain: "smartroom-a7566.firebaseapp.com",

  databaseURL: "https://smartroom-a7566-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "smartroom-a7566",
  storageBucket: "smartroom-a7566.firebasestorage.app",
  messagingSenderId: "886742997392",
  appId: "1:886742997392:web:8b679ca76a8f82e1d9bb15"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export { app };
