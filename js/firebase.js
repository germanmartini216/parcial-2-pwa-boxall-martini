
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"


const firebaseConfig = {
    apiKey: "AIzaSyDz2dOvhD2FBbLYav-Ove1Zom8RSbrrULw",
    authDomain: "trabajo-practico-2-pwa.firebaseapp.com",
    projectId: "trabajo-practico-2-pwa",
    storageBucket: "trabajo-practico-2-pwa.appspot.com",
    messagingSenderId: "517390430561",
    appId: "1:517390430561:web:5d27ab59fd530368869520"
};


export const  app = initializeApp(firebaseConfig);

export const  auth = getAuth(app);