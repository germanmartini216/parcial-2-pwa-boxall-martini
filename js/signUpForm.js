import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"


const signUpForm = document.querySelector('#signUpForm');

if(signUpForm){
    signUpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const email = signUpForm['signup-email'].value;
        const password = signUpForm['signup-password'].value;
    
        try {
            const datosDeUsuario = await createUserWithEmailAndPassword(auth, email, password);
            console.log(datosDeUsuario);
    
            const successMessage = document.querySelector('#successMessage');
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            signUpForm.style.display = 'none';
            M.toast({ html: 'Operación completada correctamente', classes: 'green' });
    
        } catch (error) {

            if (error.code === 'auth/invalid-email') {
                M.toast({ html: 'Se debe ingresar un email válido', classes: 'red lighten-3' });
            } else if (error.code === 'auth/weak-password') {
                M.toast({ html: 'Se debe ingresar una contraseña válida', classes: 'red lighten-3' });
            } else if (error.code === 'auth/email-already-in-use') {
                M.toast({ html: 'El email ya está registrado', classes: 'red lighten-3' });
            } else {
                M.toast({ html: 'Algo anda mal', classes: 'red lighten-3' });
                console.log(error.message)
            }
        }
    });
}


