const formulario = document.getElementById('form-registro');

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/usuarios/registro',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    nombre,
                    apellido,
                    correo,
                    password
                })
            }
        );

        const resultado = await respuesta.json();

        const mensaje =
            document.getElementById('mensaje-registro');

        if (!respuesta.ok) {

            mensaje.textContent = resultado.mensaje;

            return;
        }

        mensaje.textContent =
            'Usuario registrado correctamente';

        formulario.reset();

        console.log(resultado.usuario);

    } catch (error) {

        console.error(error);

        document.getElementById(
            'mensaje-registro'
        ).textContent =
            'No se pudo conectar con el servidor';
    }
});