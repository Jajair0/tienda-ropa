const listaPedidos =
    document.getElementById('lista-pedidos');


async function cargarPedidos() {

    const usuario = JSON.parse(
        localStorage.getItem('usuario')
    );


    if (!usuario) {

        listaPedidos.innerHTML = `
            <div class="mensaje-pedidos">

                <h3>Debes iniciar sesión</h3>

                <p>
                    Inicia sesión para consultar
                    tus pedidos.
                </p>

                <a href="login.html">
                    Iniciar sesión
                </a>

            </div>
        `;

        return;
    }


    try {

        const respuesta = await fetch(
            `http://localhost:3000/api/pedidos/usuario/${usuario.id_usuario}`
        );


        const pedidos = await respuesta.json();


        if (!respuesta.ok) {

            listaPedidos.innerHTML = `
                <p>
                    ${pedidos.mensaje}
                </p>
            `;

            return;
        }


        if (pedidos.length === 0) {

            listaPedidos.innerHTML = `
                <div class="mensaje-pedidos">

                    <h3>No tienes pedidos todavía</h3>

                    <p>
                        Cuando realices una compra,
                        aparecerá aquí.
                    </p>

                    <a href="productos.html">
                        Ver productos
                    </a>

                </div>
            `;

            return;
        }


        listaPedidos.innerHTML = '';


        pedidos.forEach(pedido => {

            const tarjeta =
                document.createElement('div');

            tarjeta.classList.add('pedido-card');


            const fecha =
                new Date(pedido.fecha_pedido);


            tarjeta.innerHTML = `

                <h3>
                    Pedido #${pedido.id_pedido}
                </h3>

                <p>
                    Fecha:
                    ${fecha.toLocaleDateString('es-PE')}
                </p>

                <p>
                    Estado:
                    <strong>
                        ${pedido.estado}
                    </strong>
                </p>

                <p>
                    Total:
                    <strong>
                        S/ ${Number(pedido.total).toFixed(2)}
                    </strong>
                </p>

            `;


            listaPedidos.appendChild(tarjeta);

        });


    } catch (error) {

        console.error(
            'Error al cargar pedidos:',
            error
        );


        listaPedidos.innerHTML = `
            <p>
                No se pudieron cargar tus pedidos.
            </p>
        `;
    }
}


cargarPedidos();