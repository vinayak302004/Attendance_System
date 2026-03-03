import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= FIREBASE CONFIG ================= */

const firebaseConfig = {
  apiKey: "AIzaSyDsJPGm7CwJEE2o2kI0NAiSKia0YQxEvMs",
  authDomain: "smart-attendance-login.firebaseapp.com",
  projectId: "smart-attendance-login",
  storageBucket: "smart-attendance-login.firebasestorage.app",
  messagingSenderId: "198869708642",
  appId: "1:198869708642:web:b762ec97baf3bb9c97863b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ================= DOM ELEMENTS ================= */

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");
const loginBtn = document.getElementById("loginBtn");
const loading = document.getElementById("loading");

let role = "teacher";

/* ================= ROLE SWITCH ================= */

document.getElementById("teacher").onclick = () => switchRole("teacher");
document.getElementById("student").onclick = () => switchRole("student");

function switchRole(r) {
  role = r;
  document.getElementById("teacher").classList.remove("active");
  document.getElementById("student").classList.remove("active");
  document.getElementById(r).classList.add("active");
}

/* ================= LOGIN ================= */

loginBtn.addEventListener("click", login);

async function login() {

  msg.innerText = "";

  if (!emailInput.value || !passwordInput.value) {
    msg.innerText = "Please enter email and password";
    return;
  }

  // Show loading
  loading.style.display = "block";
  loginBtn.disabled = true;
  loginBtn.innerText = "Please wait...";

  try {

    const cred = await signInWithEmailAndPassword(
      auth,
      emailInput.value,
      passwordInput.value
    );

    const snap = await getDoc(doc(db, "users", cred.user.uid));

    if (!snap.exists()) {
      throw new Error("User role not found in database");
    }

    if (snap.data().role !== role) {
      throw new Error("Role mismatch");
    }

    // Save role
    localStorage.setItem("role", role);

    // Redirect
    if (role === "teacher") {
      window.location.href = "../../Dashboard/teacher.html";
    } else {
      window.location.href = "../../Dashboard/student.html";
    }

  } catch (err) {

    msg.innerText = err.message;

    loading.style.display = "none";
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
  }
}
