import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCoBvZdNHPCCO7KDLANFaJ_Kvs-v9ajQTg",
  authDomain: "uphoto-a912b.firebaseapp.com",
  projectId: "uphoto-a912b",
  storageBucket: "uphoto-a912b.appspot.com",
  messagingSenderId: "239320519222",
  appId: "1:239320519222:web:d8926e48a5b2882ec43e97",
};

// init firebase
const app = initializeApp(firebaseConfig);

// get firebase auth instance
const auth = getAuth();

// get firebase firestore instance
const db = getFirestore(app);

// get firebase storage instance
const storage = getStorage(app);

export { app as default, auth, db, storage };
