const API_URL = 'http://localhost:3000/api/productos';

let carrito =
    JSON.parse(localStorage.getItem('carrito')) || [];

let todosLosProductos = [];


/* ========================================
   CARGAR PRODUCTOS
   ======================================== */

async function cargarProductos() {

    try {

        const respuesta = await fetch(API_URL);

        const productos = await respuesta.json();

        todosLosProductos = productos;

        mostrarProductos(todosLosProductos);

    } catch (error) {

        console.error(
            'Error al cargar productos:',
            error
        );

        const lista =
            document.getElementById('lista-productos');

        lista.innerHTML = `
            <div class="error-productos">

                <h3>
                    No se pudieron cargar los productos
                </h3>

                <p>
                    Verifica que el servidor esté funcionando.
                </p>

            </div>
        `;
    }
}


/* ========================================
   MOSTRAR PRODUCTOS
   ======================================== */

function mostrarProductos(productos) {

    const lista =
        document.getElementById('lista-productos');

    lista.innerHTML = '';

    if (productos.length === 0) {

        lista.innerHTML = `
            <div class="error-productos">

                <h3>
                    No encontramos productos
                </h3>

                <p>
                    Prueba con otra búsqueda o categoría.
                </p>

            </div>
        `;

        return;
    }


    productos.forEach(producto => {

        const tarjeta =
            document.createElement('div');

        tarjeta.classList.add(
            'producto-card'
        );


        tarjeta.innerHTML = `

            <div class="producto-imagen">

                <img
                    src="https://via.placeholder.com/500x600?text=${encodeURIComponent(producto.nombre)}"
                    alt="${producto.nombre}"
                >

                <span class="producto-categoria">
                    ${producto.categoria}
                </span>

            </div>


            <div class="producto-info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p class="producto-descripcion">
                    ${producto.descripcion || 'Producto de Urban Style'}
                </p>


                <div class="producto-detalles">

                    <span>
                        Talla:
                        <strong>
                            ${producto.talla}
                        </strong>
                    </span>

                    <span>
                        Stock:
                        <strong>
                            ${producto.stock}
                        </strong>
                    </span>

                </div>


                <div class="producto-footer">

                    <span class="producto-precio">
                        S/
                        ${Number(producto.precio).toFixed(2)}
                    </span>

                    <button
                        onclick="agregarAlCarrito(${producto.id_producto})"
                    >
                        Agregar
                    </button>

                </div>

            </div>

        `;

        lista.appendChild(tarjeta);

    });
}


/* ========================================
   FILTRAR PRODUCTOS
   ======================================== */

function filtrarProductos() {

    const texto =
        document
            .getElementById('buscador-productos')
            .value
            .toLowerCase();

    const categoria =
        document
            .getElementById('filtro-categoria')
            .value;


    const productosFiltrados =
        todosLosProductos.filter(producto => {

            const coincideNombre =
                producto.nombre
                    .toLowerCase()
                    .includes(texto);

            const coincideCategoria =
                categoria === 'todas' ||
                producto.categoria === categoria;

            return (
                coincideNombre &&
                coincideCategoria
            );

        });


    mostrarProductos(
        productosFiltrados
    );
}


/* ========================================
   AGREGAR AL CARRITO
   ======================================== */

async function agregarAlCarrito(idProducto) {

    try {

        const producto =
            todosLosProductos.find(
                p =>
                    p.id_producto === idProducto
            );


        if (!producto) {

            alert(
                'Producto no encontrado'
            );

            return;
        }


        const productoCarrito =
            carrito.find(
                p =>
                    p.id_producto === idProducto
            );


        if (productoCarrito) {

            if (
                productoCarrito.cantidad <
                producto.stock
            ) {

                productoCarrito.cantidad++;

            } else {

                alert(
                    'No hay más stock disponible'
                );

                return;
            }

        } else {

            carrito.push({

                id_producto:
                    producto.id_producto,

                nombre:
                    producto.nombre,

                precio:
                    Number(producto.precio),

                talla:
                    producto.talla,

                cantidad: 1

            });

        }


        localStorage.setItem(
            'carrito',
            JSON.stringify(carrito)
        );


        alert(
            `${producto.nombre} agregado al carrito`
        );


    } catch (error) {

        console.error(
            'Error al agregar al carrito:',
            error
        );

    }

}


/* ========================================
   EVENTOS DE BÚSQUEDA
   ======================================== */

document
    .getElementById('buscador-productos')
    .addEventListener(
        'input',
        filtrarProductos
    );


document
    .getElementById('filtro-categoria')
    .addEventListener(
        'change',
        filtrarProductos
    );


/* ========================================
   INICIAR
   ======================================== */

cargarProductos();

