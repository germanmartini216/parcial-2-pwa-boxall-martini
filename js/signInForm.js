import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
import { auth } from "./firebase.js"

const signInForm = document.querySelector('#signInForm');

if (signInForm) {
    signInForm.addEventListener('submit', async e => {
        e.preventDefault();

        const email = signInForm['login-email'].value;
        const password = signInForm['login-password'].value;

        try {
            const preloader = document.querySelector('#preloader');
            const loginLogo = document.querySelector('#login-logo');
            loginLogo.style.display = 'none';
            preloader.style.display = 'block';
            
            // Pequeño retraso para que el preloader se renderice
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const credentials = await signInWithEmailAndPassword(auth, email, password);
            console.log(credentials);
        
            M.toast({ html: 'Bienvenido ' + email, classes: 'green' });
        
            // Redirigir al usuario después de mostrar el preloader
            setTimeout(() => {
                window.location.href = "../index.html";
            }, 1500); // Ajusta el tiempo según sea necesario
            
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/invalid-email') {
                M.toast({ html: 'Se debe ingresar un email válido', classes: 'red lighten-3' });
            } else if (error.code === 'auth/wrong-password') {
                M.toast({ html: 'La contraseña es incorrecta', classes: 'red lighten-3' });
            } else if (error.code === 'auth/user-not-found') {
                M.toast({ html: 'El usuario no está registrado', classes: 'red lighten-3' });
            } else if (error.code === 'auth/invalid-credential') {
                M.toast({ html: 'La contraseña o el email son incorrectos', classes: 'red lighten-3' });
            } else {
                M.toast({ html: 'Algo anda mal', classes: 'red lighten-3' });
                console.log(error.message);
            }
        
            // Ocultar el preloader si hay un error
            const preloader = document.querySelector('.preloader');
            preloader.style.display = 'none';
        }
    })
}

