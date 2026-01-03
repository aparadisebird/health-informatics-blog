import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjvTISsUZsWmtKPVwRGVHiM_oUedU_BLs",
  authDomain: "the-health-nexus.firebaseapp.com",
  projectId: "the-health-nexus",
  storageBucket: "the-health-nexus.firebasestorage.app",
  messagingSenderId: "907886498214",
  appId: "1:907886498214:web:601c880bbeeecba51dff67"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };