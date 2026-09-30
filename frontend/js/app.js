const API_URL = 'http://localhost:3000/api/productos';

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

async function cargarProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();

        const lista = document.getElementById('lista-productos');

        productos.forEach(producto => {
            const tarjeta = document.createElement('div');

            tarjeta.innerHTML = `
                <div class="producto-imagen">
                    <img 
                        src="https://via.placeholder.com/300x350?text=${encodeURIComponent(producto.nombre)}"
                        alt="${producto.nombre}"
                    >
                </div>

                <h3>${producto.nombre}</h3>

                <p>${producto.descripcion}</p>

                <p class="precio">
                    S/ ${producto.precio}
                </p>

                <p>Talla: ${producto.talla}</p>
                <p>Stock disponible: ${producto.stock}</p>
                <p>Categoría: ${producto.categoria}</p>

                <button onclick="agregarAlCarrito(${producto.id_producto})">
                    Agregar al carrito
                </button>
            `;

            lista.appendChild(tarjeta);
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

async function agregarAlCarrito(idProducto) {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();

        const producto = productos.find(
            p => p.id_producto === idProducto
        );

        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        const productoCarrito = carrito.find(
            p => p.id_producto === idProducto
        );

        if (productoCarrito) {

            if (productoCarrito.cantidad < producto.stock) {
                productoCarrito.cantidad++;
            } else {
                alert('No hay más stock disponible');
                return;
            }

        } else {

            carrito.push({
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                talla: producto.talla,
                cantidad: 1
            });
        }

        localStorage.setItem('carrito', JSON.stringify(carrito));

        alert(`${producto.nombre} agregado al carrito`);

    } catch (error) {
        console.error('Error:', error);
    }
}

cargarProductos();