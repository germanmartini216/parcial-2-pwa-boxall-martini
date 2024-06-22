import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"

const logout = document.querySelector('#logout')

if(logout){
    logout.addEventListener('click', async () =>{
        await signOut(auth)
        
        console.log('El usuario ha cerrado la sesion')
    }) 
}
