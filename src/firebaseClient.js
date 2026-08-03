import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCnyOIlnTHABtQRZrh6o3ySPkOOc9JofmM",
  authDomain: "saree-godown.firebaseapp.com",
  projectId: "saree-godown",
  storageBucket: "saree-godown.firebasestorage.app",
  messagingSenderId: "616787931166",
  appId: "1:616787931166:web:786e838bae530bbc8c3e0f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
