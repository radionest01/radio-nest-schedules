// Your Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBYX0zC6sNg02nhyDp36oPi-XOHQkOniro",
  authDomain: "radio-nest-schedules.firebaseapp.com",
  projectId: "radio-nest-schedules",
  storageBucket: "radio-nest-schedules.appspot.com",
  messagingSenderId: "461314444975",
  appId: "1:461314444975:web:4872e913324e789b6a4e5a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
