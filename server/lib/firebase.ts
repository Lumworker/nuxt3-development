import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics  } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDax17_J1YHctUVF5uWeLVPAFuMtY77NnU",
  authDomain: "nuxt3-firebase-storage-7202c.firebaseapp.com",
  projectId: "nuxt3-firebase-storage-7202c",
  storageBucket: "nuxt3-firebase-storage-7202c.appspot.com",
  messagingSenderId: "56550953501",
  appId: "1:56550953501:web:ba8ae6cbe318de12432cf4",
  measurementId: "G-W8P5X47DNN"
};

// Initialize Firebase Analytics only if it is supported
const app = initializeApp(firebaseConfig);
let analytics;

try {
  // analytics = getAnalytics(app);
  if (app.name && typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  console.log("Firebase Analytics initialized successfully.");
} catch (e) {
  console.warn("Firebase Analytics is not supported in this environment.=>",e);
}

export const firebaseApp = app;
// export const firestoreDb = analytics;
export const firestoreDb = getFirestore(firebaseApp);

