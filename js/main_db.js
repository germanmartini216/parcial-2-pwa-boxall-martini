import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { loginCheck } from './loginCheck.js'

import './signUpForm.js'
import './logout.js'
import './signInForm.js'


onAuthStateChanged(auth, async (user) => {
    
    loginCheck(user)

    // if (user) {
    //     loginCheck(user)
    // } else {
    //     loginCheck(user)
    // };  
});