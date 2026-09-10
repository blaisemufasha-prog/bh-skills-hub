import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyB589OXINetS1PMr2i8SSU6YRZ-khF3nj8",
    authDomain: "bh-skills-hub.firebaseapp.com",
    projectId: "bh-skills-hub",
    storageBucket: "bh-skills-hub.firebasestorage.app",
    messagingSenderId: "503359590632",
    appId: "1:503359590632:web:5b81f57e402addaf2bb95d6"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };