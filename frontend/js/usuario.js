function actualizarMenuUsuario() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );

    const nav = document.querySelector('nav');

    if (!nav) {
        return;
    }

    const enlaceLogin = nav.querySelector(
        'a[href="login.html"]'
    );

    if (usuario) {

        if (enlaceLogin) {
            enlaceLogin.remove();
        }

        if (!nav.querySelector('.usuario-saludo')) {

            const saludo = document.createElement('span');

            saludo.textContent =
                `Hola, ${usuario.nombre}`;

            saludo.classList.add('usuario-saludo');

            nav.appendChild(saludo);
        }


        if (!nav.querySelector('.btn-cerrar-sesion')) {

            const botonCerrar =
                document.createElement('button');

            botonCerrar.textContent =
                'Cerrar sesión';

            botonCerrar.classList.add(
                'btn-cerrar-sesion'
            );

            botonCerrar.addEventListener(
                'click',
                cerrarSesion
            );

            nav.appendChild(botonCerrar);
        }

    } else {

        if (!enlaceLogin) {

            const nuevoLogin =
                document.createElement('a');

            nuevoLogin.href = 'login.html';

            nuevoLogin.textContent =
                'Iniciar sesión';

            nav.appendChild(nuevoLogin);
        }
    }
}


function cerrarSesion() {

    localStorage.removeItem('usuario');

    alert('Sesión cerrada correctamente');

    window.location.href = 'index.html';
}


actualizarMenuUsuario();