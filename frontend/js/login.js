const formulario =
    document.getElementById('form-login');


formulario.addEventListener(
    'submit',
    async (evento) => {

        evento.preventDefault();


        const correo =
            document.getElementById('correo').value;

        const password =
            document.getElementById('password').value;


        try {

            const respuesta = await fetch(
                'http://localhost:3000/api/usuarios/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        correo,
                        password
                    })
                }
            );


            const resultado =
                await respuesta.json();


            const mensaje =
                document.getElementById(
                    'mensaje-login'
                );


            if (!respuesta.ok) {

                mensaje.textContent =
                    resultado.mensaje;

                return;
            }


            /* Guardar usuario */

            localStorage.setItem(
                'usuario',
                JSON.stringify(
                    resultado.usuario
                )
            );


            mensaje.textContent =
                `Bienvenido, ${resultado.usuario.nombre}`;


            /* =================================
               REDIRECCIÓN DEL ADMINISTRADOR
               ================================= */

            if (
                resultado.usuario.rol === 'ADMIN'
            ) {

                setTimeout(() => {

                    window.location.href =
                        'admin/index.html';

                }, 800);

            }


        } catch (error) {

            console.error(error);

            document.getElementById(
                'mensaje-login'
            ).textContent =
                'No se pudo conectar con el servidor';
        }

    }
);

