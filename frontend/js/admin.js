const usuario = JSON.parse(
    localStorage.getItem('usuario')
);

if (!usuario || usuario.rol !== 'ADMIN') {

    alert(
        'No tienes permisos para acceder al panel de administración.'
    );

    window.location.href =
        '../index.html';
}

async function cargarEstadisticas() {

    try {

        const respuesta =
            await fetch(
                'http://localhost:3000/api/admin/estadisticas'
            );

        const estadisticas =
            await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                estadisticas.mensaje
            );
        }

        document.getElementById(
            'total-usuarios'
        ).textContent =
            estadisticas.usuarios;

        document.getElementById(
            'total-productos'
        ).textContent =
            estadisticas.productos;

        document.getElementById(
            'total-pedidos'
        ).textContent =
            estadisticas.pedidos;

        document.getElementById(
            'total-ventas'
        ).textContent =
            `S/ ${Number(
                estadisticas.ventas
            ).toFixed(2)}`;

    } catch (error) {

        console.error(
            'Error al cargar estadísticas:',
            error
        );
    }
}

function cerrarSesionAdmin() {

    localStorage.removeItem(
        'usuario'
    );

    window.location.href =
        '../index.html';
}

cargarEstadisticas();