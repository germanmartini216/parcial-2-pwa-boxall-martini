import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"

const signUpForm = document.querySelector('#signUpForm')

signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = signUpForm['signup-email'].value
    const password = signUpForm['signup-password'].value

    try {
        const datosDeUsuario = await createUserWithEmailAndPassword(auth, email, password);
        console.log(datosDeUsuario)

        successMessage.style.display = 'block';
        signUpForm.style.display = 'none';
        
    } catch (error) {
        console.log('Error al crear el usuario:', error)
    }
})