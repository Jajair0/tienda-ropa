
const usuario = JSON.parse(localStorage.getItem('usuario'));

let productosAdmin = [];
let idProductoEditando = null;

/* VERIFICAR ADMINISTRADOR */
if (!usuario || usuario.rol !== 'ADMIN') {
    alert('No tienes permisos para acceder a esta página.');
    window.location.href = '../index.html';
}

/* CARGAR PRODUCTOS */
async function cargarProductosAdmin() {
    try {
        const respuesta = await fetch(
            'http://localhost:3000/api/admin/productos'
        );

        const productos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(productos.mensaje);
        }

        productosAdmin = productos;

        const tabla = document.getElementById('tabla-productos');
        tabla.innerHTML = '';

        if (productos.length === 0) {
            tabla.innerHTML = `
                <tr>
                    <td colspan="7">No hay productos registrados.</td>
                </tr>
            `;
            return;
        }

        productos.forEach(producto => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${producto.id_producto}</td>
                <td><strong>${producto.nombre}</strong></td>
                <td>${producto.categoria}</td>
                <td>S/ ${Number(producto.precio).toFixed(2)}</td>
                <td>${producto.stock}</td>
                <td>${producto.talla || '-'}</td>
                <td>
                    <button class="btn-admin-editar"
                        onclick="editarProducto(${producto.id_producto})">
                        Editar
                    </button>
                    <button class="btn-admin-eliminar"
                        onclick="eliminarProducto(${producto.id_producto})">
                        Eliminar
                    </button>
                </td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al cargar productos:', error);

        document.getElementById('tabla-productos').innerHTML = `
            <tr>
                <td colspan="7">No se pudieron cargar los productos.</td>
            </tr>
        `;
    }
}

/* MOSTRAR FORMULARIO PARA AGREGAR */
function mostrarFormulario() {
    idProductoEditando = null;

    document.getElementById('form-agregar-producto').reset();

    document.getElementById('titulo-formulario-producto').textContent =
        'Agregar producto';

    document.getElementById('btn-guardar-producto').textContent =
        'Guardar producto';

    const formulario = document.getElementById('formulario-producto');
    formulario.style.display = 'block';
    formulario.scrollIntoView({ behavior: 'smooth' });
}

/* OCULTAR FORMULARIO */
function ocultarFormulario() {
    document.getElementById('formulario-producto').style.display = 'none';
    document.getElementById('form-agregar-producto').reset();

    idProductoEditando = null;

    document.getElementById('titulo-formulario-producto').textContent =
        'Agregar producto';

    document.getElementById('btn-guardar-producto').textContent =
        'Guardar producto';
}

/* EDITAR PRODUCTO */
function editarProducto(idProducto) {
    const producto = productosAdmin.find(
        p => Number(p.id_producto) === Number(idProducto)
    );

    if (!producto) {
        alert('No se encontró el producto.');
        return;
    }

    idProductoEditando = producto.id_producto;

    document.getElementById('nombre-producto').value =
        producto.nombre || '';

    document.getElementById('categoria-producto').value =
        String(producto.id_categoria);

    document.getElementById('precio-producto').value =
        producto.precio;

    document.getElementById('stock-producto').value =
        producto.stock;

    document.getElementById('talla-producto').value =
        producto.talla || '';

    document.getElementById('descripcion-producto').value =
        producto.descripcion || '';

    document.getElementById('titulo-formulario-producto').textContent =
        'Editar producto';

    document.getElementById('btn-guardar-producto').textContent =
        'Actualizar producto';

    const formulario = document.getElementById('formulario-producto');
    formulario.style.display = 'block';
    formulario.scrollIntoView({ behavior: 'smooth' });
}

/* GUARDAR O ACTUALIZAR PRODUCTO */
document.getElementById('form-agregar-producto').addEventListener(
    'submit',
    async (evento) => {
        evento.preventDefault();

        const nombre = document.getElementById('nombre-producto').value.trim();
        const descripcion = document.getElementById('descripcion-producto').value.trim();
        const precio = document.getElementById('precio-producto').value;
        const stock = document.getElementById('stock-producto').value;
        const talla = document.getElementById('talla-producto').value.trim();
        const id_categoria = document.getElementById('categoria-producto').value;

        if (!nombre || precio === '' || stock === '' || !id_categoria) {
            alert('Completa los campos obligatorios.');
            return;
        }

        const editando = idProductoEditando !== null;

        const url = editando
            ? `http://localhost:3000/api/admin/productos/${idProductoEditando}`
            : 'http://localhost:3000/api/admin/productos';

        try {
            const respuesta = await fetch(url, {
                method: editando ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio: Number(precio),
                    stock: Number(stock),
                    talla,
                    id_categoria: Number(id_categoria)
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                alert(resultado.mensaje || 'No se pudo guardar el producto.');
                return;
            }

            alert(
                editando
                    ? 'Producto actualizado correctamente.'
                    : 'Producto agregado correctamente.'
            );

            ocultarFormulario();
            await cargarProductosAdmin();

        } catch (error) {
            console.error('Error al guardar producto:', error);
            alert('No se pudo conectar con el servidor.');
        }
    }
);

/* ELIMINAR: LO IMPLEMENTAREMOS DESPUÉS */

async function eliminarProducto(idProducto) {
    const producto = productosAdmin.find(
        p => Number(p.id_producto) === Number(idProducto)
    );

    if (!producto) {
        alert('No se encontró el producto.');
        return;
    }

    const confirmar = confirm(
        `¿Estás seguro de eliminar "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmar) {
        return;
    }

    try {
        const respuesta = await fetch(
            `http://localhost:3000/api/admin/productos/${idProducto}`,
            {
                method: 'DELETE'
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            alert(resultado.mensaje || 'No se pudo eliminar el producto.');
            return;
        }

        alert('Producto eliminado correctamente.');
        await cargarProductosAdmin();

    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('No se pudo conectar con el servidor.');
    }
}


/* CERRAR SESIÓN */
function cerrarSesionAdmin() {
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}

/* INICIAR */
cargarProductosAdmin();
