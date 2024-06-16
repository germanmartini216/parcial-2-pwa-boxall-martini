document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const primerNombre = document.getElementById('primerNombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('Mensaje').value.trim();

        if (!primerNombre || !apellido || !email || !mensaje) {
            M.toast({html: 'Por favor, complete todos los campos.', classes: 'red'});
            return;
        }

        if (!validateEmail(email)) {
            M.toast({html: 'Por favor, ingrese un email válido.', classes: 'red'});
            return;
        }

        M.toast({html: 'Tu mensaje ha sido enviado exitosamente!', classes: 'green'});
        form.reset();
    });

    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }
});
