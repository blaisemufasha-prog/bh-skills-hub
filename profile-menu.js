/* =========================================================
   BH SKILLS HUB - GLOBAL PROFILE MENU
   Works on Dashboard + All Course Pages
========================================================= */

import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIG
========================================================= */

const firebaseConfig = {
  apiKey: "AIzaSyB589OXINetS1PMr2i8SSU6YRZ-khF3nj8",
  authDomain: "bh-skills-hub.firebaseapp.com",
  projectId: "bh-skills-hub",
  storageBucket: "bh-skills-hub.firebasestorage.app",
  messagingSenderId: "503359590632",
  appId: "1:503359590632:web:5b81f57e402addaf2bb95d"
};


/* =========================================================
   FIREBASE INITIALIZATION
========================================================= */

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


/* =========================================================
   GLOBAL CSS
========================================================= */

const style = document.createElement("style");

style.textContent = `

/* ================= PROFILE AREA ================= */

.bh-profile-area {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 99999;
}


/* ================= AVATAR BUTTON ================= */

.bh-profile-button {

  width: 45px;
  height: 45px;

  border-radius: 50%;

  border: 2px solid white;

  background: #374151;

  color: white;

  cursor: pointer;

  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  font-size: 20px;

  transition: .2s;

}

.bh-profile-button:hover {

  transform: scale(1.05);

  box-shadow:
    0 0 0 3px rgba(37,99,235,.25);

}


.bh-profile-button img {

  width: 100%;
  height: 100%;

  object-fit: cover;

  display: none;

}


/* ================= PROFILE MENU ================= */

.bh-profile-menu {

  display: none;

  position: absolute;

  top: 55px;

  right: 0;

  width: 330px;

  max-height: 80vh;

  overflow-y: auto;

  background: white;

  color: #172033;

  border-radius: 18px;

  border: 1px solid #e5e7eb;

  box-shadow:
    0 15px 45px rgba(0,0,0,.20);

  padding: 20px;

  animation: bhProfileIn .18s ease;

}


.bh-profile-menu.show {

  display: block;

}


@keyframes bhProfileIn {

  from {

    opacity: 0;

    transform: translateY(-8px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }

}


/* ================= PROFILE HEADER ================= */

.bh-profile-header {

  text-align: center;

  padding-bottom: 16px;

  margin-bottom: 16px;

  border-bottom: 1px solid #e5e7eb;

}


.bh-profile-photo {

  width: 78px;
  height: 78px;

  border-radius: 50%;

  object-fit: cover;

  background: #e5e7eb;

  border: 3px solid #2563eb;

  margin-bottom: 9px;

}


.bh-profile-header h3 {

  margin: 0 0 4px;

  font-size: 18px;

}


.bh-profile-header p {

  margin: 0;

  color: #6b7280;

  font-size: 13px;

  word-break: break-word;

}


/* ================= PERSONAL INFORMATION ================= */

.bh-section-title {

  font-size: 13px;

  font-weight: 800;

  color: #111827;

  margin-bottom: 12px;

}


.bh-info-row {

  margin-bottom: 11px;

}


.bh-info-row small {

  display: block;

  color: #6b7280;

  font-size: 11px;

  margin-bottom: 3px;

}


.bh-info-row strong {

  display: block;

  color: #172033;

  font-size: 13px;

  word-break: break-word;

  line-height: 1.4;

}


/* ================= SETTINGS ================= */

.bh-settings {

  margin-top: 18px;

  padding-top: 16px;

  border-top: 1px solid #e5e7eb;

}


.bh-setting-button {

  width: 100%;

  border: none;

  background: #f3f4f6;

  color: #172033;

  padding: 11px 12px;

  border-radius: 10px;

  cursor: pointer;

  text-align: left;

  font-weight: 700;

  margin-bottom: 8px;

  font-size: 13px;

}


.bh-setting-button:hover {

  background: #e5e7eb;

}


.bh-edit-button {

  background: #2563eb;

  color: white;

}


.bh-edit-button:hover {

  background: #1d4ed8;

}


.bh-dashboard-button {

  background: #eff6ff;

  color: #1d4ed8;

}


.bh-logout-button {

  background: #fee2e2;

  color: #b91c1c;

}


.bh-logout-button:hover {

  background: #fecaca;

}


/* ================= LOADING ================= */

.bh-profile-loading {

  text-align: center;

  color: #6b7280;

  padding: 15px;

  font-size: 13px;

}


/* ================= MOBILE ================= */

@media(max-width:600px) {

  .bh-profile-button {

    width: 40px;
    height: 40px;

  }


  .bh-profile-menu {

    position: fixed;

    top: 68px;

    left: 4%;

    right: 4%;

    width: auto;

    max-height: 82vh;

  }

}

`;

document.head.appendChild(style);


/* =========================================================
   CREATE PROFILE UI
========================================================= */

const profileArea = document.createElement("div");

profileArea.className = "bh-profile-area";

profileArea.innerHTML = `

  <button
    class="bh-profile-button"
    id="bhProfileButton"
    type="button"
    title="My Profile"
  >

    <span id="bhAvatarEmoji">👤</span>

    <img
      id="bhHeaderAvatar"
      alt="Profile"
    >

  </button>


  <div
    class="bh-profile-menu"
    id="bhProfileMenu"
  >

    <div class="bh-profile-header">

      <img
        id="bhMenuPhoto"
        class="bh-profile-photo"
        src=""
        alt="Profile Photo"
      >

      <h3 id="bhMenuName">
        Student
      </h3>

      <p id="bhMenuEmail">
        Loading...
      </p>

    </div>


    <div class="bh-section-title">
      👤 Personal Information
    </div>


    <div class="bh-info-row">

      <small>Full Name</small>

      <strong id="bhInfoName">
        —
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Email</small>

      <strong id="bhInfoEmail">
        —
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Phone</small>

      <strong id="bhInfoPhone">
        Not added
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Country</small>

      <strong id="bhInfoCountry">
        Not added
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Institution</small>

      <strong id="bhInfoInstitution">
        Not added
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Occupation / Field</small>

      <strong id="bhInfoOccupation">
        Not added
      </strong>

    </div>


    <div class="bh-info-row">

      <small>Bio</small>

      <strong id="bhInfoBio">
        Not added
      </strong>

    </div>


    <!-- SETTINGS -->

    <div class="bh-settings">

      <div class="bh-section-title">
        ⚙️ Settings
      </div>


      <button
        class="bh-setting-button bh-edit-button"
        id="bhEditProfile"
        type="button"
      >
        ✏️ Edit Profile
      </button>


      <button
        class="bh-setting-button bh-dashboard-button"
        id="bhDashboard"
        type="button"
      >
        🏠 Student Dashboard
      </button>


      <button
        class="bh-setting-button"
        id="bhPassword"
        type="button"
      >
        🔐 Change Password
      </button>


      <button
        class="bh-setting-button bh-logout-button"
        id="bhLogout"
        type="button"
      >
        🚪 Logout
      </button>

    </div>

  </div>

`;


/* =========================================================
   FIND BEST PLACE FOR PROFILE
========================================================= */

function insertProfile() {

  /*
    First try existing header profile container.
  */

  const existingContainer =
    document.querySelector(
      "#profileContainer, .profile-container, .header-profile"
    );


  if (existingContainer) {

    existingContainer.appendChild(
      profileArea
    );

    return;

  }


  /*
    Otherwise put it directly inside header.
  */

  const header =
    document.querySelector("header");


  if (header) {

    header.appendChild(profileArea);

    return;

  }


  /*
    Last fallback.
  */

  document.body.prepend(profileArea);

}


insertProfile();


/* =========================================================
   DOM
========================================================= */

const profileButton =
  document.getElementById(
    "bhProfileButton"
  );

const profileMenu =
  document.getElementById(
    "bhProfileMenu"
  );

const headerAvatar =
  document.getElementById(
    "bhHeaderAvatar"
  );

const avatarEmoji =
  document.getElementById(
    "bhAvatarEmoji"
  );

const menuPhoto =
  document.getElementById(
    "bhMenuPhoto"
  );


/* =========================================================
   PROFILE PHOTO
========================================================= */

function setProfilePhoto(url) {

  if (!url) {

    headerAvatar.style.display =
      "none";

    avatarEmoji.style.display =
      "block";

    return;

  }


  headerAvatar.src =
    url;

  headerAvatar.style.display =
    "block";

  avatarEmoji.style.display =
    "none";


  menuPhoto.src =
    url;

}


/* =========================================================
   LOAD PROFILE FROM FIRESTORE
========================================================= */

async function loadProfile(user) {

  if (!user) return;


  let data = {};


  try {

    const userRef =
      doc(
        db,
        "users",
        user.uid
      );


    const snapshot =
      await getDoc(userRef);


    if (snapshot.exists()) {

      data =
        snapshot.data();

    }

  } catch (error) {

    console.error(
      "BH Skills Hub profile error:",
      error
    );

  }


  const name =
    data.name ||
    user.displayName ||
    user.email?.split("@")[0] ||
    "Student";


  const email =
    data.email ||
    user.email ||
    "";


  document.getElementById(
    "bhMenuName"
  ).textContent =
    name;


  document.getElementById(
    "bhMenuEmail"
  ).textContent =
    email;


  document.getElementById(
    "bhInfoName"
  ).textContent =
    name;


  document.getElementById(
    "bhInfoEmail"
  ).textContent =
    email;


  document.getElementById(
    "bhInfoPhone"
  ).textContent =
    data.phone ||
    "Not added";


  document.getElementById(
    "bhInfoCountry"
  ).textContent =
    data.country ||
    "Not added";


  document.getElementById(
    "bhInfoInstitution"
  ).textContent =
    data.institution ||
    "Not added";


  document.getElementById(
    "bhInfoOccupation"
  ).textContent =
    data.occupation ||
    "Not added";


  document.getElementById(
    "bhInfoBio"
  ).textContent =
    data.bio ||
    "Not added";


  const photo =
    data.photoURL ||
    user.photoURL ||
    "";


  setProfilePhoto(photo);

}


/* =========================================================
   AUTH STATE
========================================================= */

onAuthStateChanged(
  auth,
  async function(user) {

    if (!user) {

      /*
        Do not immediately redirect.
        Other pages may already have their own auth handling.
      */

      return;

    }


    await loadProfile(user);

  }
);


/* =========================================================
   OPEN / CLOSE PROFILE
========================================================= */

profileButton.addEventListener(
  "click",
  function(event) {

    event.stopPropagation();

    profileMenu.classList.toggle(
      "show"
    );

  }
);


/* =========================================================
   CLOSE WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener(
  "click",
  function(event) {

    if (
      !event.target.closest(
        ".bh-profile-area"
      )
    ) {

      profileMenu.classList.remove(
        "show"
      );

    }

  }
);


/* =========================================================
   EDIT PROFILE
========================================================= */

document
  .getElementById("bhEditProfile")
  .addEventListener(
    "click",
    function() {

      window.location.href =
        "student-profile.html";

    }
  );


/* =========================================================
   DASHBOARD
========================================================= */

document
  .getElementById("bhDashboard")
  .addEventListener(
    "click",
    function() {

      window.location.href =
        "student-dashboard.html";

    }
  );


/* =========================================================
   CHANGE PASSWORD
========================================================= */

document
  .getElementById("bhPassword")
  .addEventListener(
    "click",
    function() {

      window.location.href =
        "forgot-password.html";

    }
  );


/* =========================================================
   LOGOUT
========================================================= */

document
  .getElementById("bhLogout")
  .addEventListener(
    "click",
    async function() {

      const button =
        document.getElementById(
          "bhLogout"
        );


      button.disabled =
        true;


      button.textContent =
        "Logging out...";


      try {

        await signOut(auth);


        window.location.replace(
          "login.html"
        );


      } catch (error) {

        console.error(
          "Logout error:",
          error
        );


        button.disabled =
          false;


        button.textContent =
          "🚪 Logout";


        alert(
          "Logout failed: " +
          error.message
        );

      }

    }
  );


/* =========================================================
   REFRESH PROFILE WHEN RETURNING TO PAGE
========================================================= */

document.addEventListener(
  "visibilitychange",
  async function() {

    if (
      document.visibilityState ===
      "visible"
    ) {

      const user =
        auth.currentUser;


      if (user) {

        await loadProfile(user);

      }

    }

  }
);