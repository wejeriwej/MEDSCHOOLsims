// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA1YesaUZxtmjY0Gbq_sj8YKhEyLvUZwY4",
  authDomain: "medschoolsims.firebaseapp.com",
  projectId: "medschoolsims",
  storageBucket: "medschoolsims.firebasestorage.app",
  messagingSenderId: "11403063542",
  appId: "1:11403063542:web:5e0104cb6011afcff93cd7",
  measurementId: "G-186P20FY7F"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Initialize services and export globals
const auth = firebase.auth();
const db = firebase.firestore();
