// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAP4K83hBlIEW_2fPdMSAIpYDKGLYO3Sjo",
  authDomain: "oscereal-706d4.firebaseapp.com",
  projectId: "oscereal-706d4",
  storageBucket: "oscereal-706d4.firebasestorage.app",
  messagingSenderId: "170410147985",
  appId: "1:170410147985:web:c1c83b71f47f794dff7f30"
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Initialize services and export globals
const auth = firebase.auth();
const db = firebase.firestore();
