// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyB_xZca3wrB-HqvbjFAfVrRsps89Nink8A",
  authDomain: "lumina-skin-care.firebaseapp.com",
  projectId: "lumina-skin-care",
  storageBucket: "lumina-skin-care.appspot.com",
  messagingSenderId: "654070228073",
  appId: "1:654070228073:web:518f9ee3cd86810bf62ef8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web' 
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });

export const firestore = getFirestore(app);