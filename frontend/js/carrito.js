let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarCarrito() {

    const lista = document.getElementById('lista-carrito');
    const resumen = document.getElementById('resumen-carrito');

    lista.innerHTML = '';
    resumen.innerHTML = '';

    if (carrito.length === 0) {

        lista.innerHTML = `
            <div class="carrito-vacio">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos para continuar.</p>

                <a href="productos.html">
                    Ver productos
                </a>
            </div>
        `;

        return;
    }

    let total = 0;

    carrito.forEach((producto, indice) => {

        const subtotal = producto.precio * producto.cantidad;

        total += subtotal;

        const productoHTML = document.createElement('div');

        productoHTML.classList.add('producto-carrito');

        productoHTML.innerHTML = `
            <div>
                <h3>${producto.nombre}</h3>
                <p>Talla: ${producto.talla}</p>
                <p>Precio: S/ ${producto.precio.toFixed(2)}</p>
            </div>

            <div class="cantidad">

                <button onclick="disminuirCantidad(${indice})">
                    -
                </button>

                <span>${producto.cantidad}</span>

                <button onclick="aumentarCantidad(${indice})">
                    +
                </button>

            </div>

            <div>
                <p>
                    Subtotal:
                    <strong>S/ ${subtotal.toFixed(2)}</strong>
                </p>

                <button onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            </div>
        `;

        lista.appendChild(productoHTML);
    });

    resumen.innerHTML = `
        <div class="total-carrito">

            <h3>Total: S/ ${total.toFixed(2)}</h3>

            <button onclick="finalizarCompra()">
                Finalizar compra
            </button>

        </div>
    `;
}


function aumentarCantidad(indice) {

    carrito[indice].cantidad++;

    guardarCarrito();

    mostrarCarrito();
}


function disminuirCantidad(indice) {

    if (carrito[indice].cantidad > 1) {

        carrito[indice].cantidad--;

    } else {

        carrito.splice(indice, 1);

    }

    guardarCarrito();

    mostrarCarrito();
}


function eliminarProducto(indice) {

    carrito.splice(indice, 1);

    guardarCarrito();

    mostrarCarrito();
}


function guardarCarrito() {

    localStorage.setItem(
        'carrito',
        JSON.stringify(carrito)
    );
}


async function finalizarCompra() {

    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const datosPedido = {
        id_usuario: 1,
        productos: carrito.map(producto => ({
            id_producto: producto.id_producto,
            cantidad: producto.cantidad
        }))
    };

    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/pedidos',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(datosPedido)
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje);
            return;
        }

        alert(
            `Compra realizada correctamente.\n\n` +
            `Pedido N.º ${resultado.id_pedido}\n` +
            `Total: S/ ${resultado.total}`
        );

        carrito = [];

        localStorage.removeItem('carrito');

        mostrarCarrito();

    } catch (error) {

        console.error('Error:', error);

        alert('No se pudo procesar la compra');
    }
}


mostrarCarrito();