// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
import { getDatabase, onValue, ref, set } from "firebase/database";

import { firebase } from "@firebase/app";
import "@firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBPNCxFTf6ew83aKV_PawA_1_7eIQ7VOpA",
//   authDomain: "fir-25-12-2022.firebaseapp.com",
//   projectId: "fir-25-12-2022",
//   storageBucket: "fir-25-12-2022.appspot.com",
//   messagingSenderId: "771222562534",
//   appId: "1:771222562534:web:bc7f1087d83a7e567c3d27"
// };

const firebaseConfig = {
  apiKey: "AIzaSyDShQgoPAaJAQRttQUhagA1UP1l5ImQImA",
  authDomain: "projectone-fef60.firebaseapp.com",
  projectId: "projectone-fef60",
  storageBucket: "projectone-fef60.appspot.com",
  messagingSenderId: "866657700029",
  appId: "1:866657700029:web:bd88f68ecc370a70048fd4"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);



const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const db = getFirestore(app);
const database = getDatabase(app);

export { auth, db, storage, firestore, database };


