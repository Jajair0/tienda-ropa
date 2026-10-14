const pool = require('../config/database');


const obtenerEstadisticas = async (req, res) => {

    try {

        const usuarios = await pool.query(
            `SELECT COUNT(*) AS total
             FROM usuarios`
        );

        const productos = await pool.query(
            `SELECT COUNT(*) AS total
             FROM productos`
        );

        const pedidos = await pool.query(
            `SELECT COUNT(*) AS total
             FROM pedidos`
        );

        const ventas = await pool.query(
            `SELECT COALESCE(SUM(total), 0) AS total
             FROM pedidos`
        );

        res.json({
            usuarios: Number(
                usuarios.rows[0].total
            ),

            productos: Number(
                productos.rows[0].total
            ),

            pedidos: Number(
                pedidos.rows[0].total
            ),

            ventas: Number(
                ventas.rows[0].total
            )
        });

    } catch (error) {

        console.error(
            'Error al obtener estadísticas:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener las estadísticas'
        });
    }
};


const obtenerProductosAdmin = async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                p.id_producto,
                p.id_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.stock,
                p.talla,
                c.nombre AS categoria
            FROM productos p
            INNER JOIN categorias c
                ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto;
        `);

        res.json(resultado.rows);

    } catch (error) {

        console.error(
            'Error al obtener productos:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al obtener los productos'
        });
    }
};


module.exports = {
    obtenerEstadisticas,
    obtenerProductosAdmin
};

const agregarProducto = async (req, res) => {

    const {
        nombre,
        descripcion,
        precio,
        stock,
        talla,
        id_categoria
    } = req.body;

    if (
        !nombre ||
        precio === undefined ||
        stock === undefined ||
        !id_categoria
    ) {
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    try {

        const resultado = await pool.query(
            `INSERT INTO productos
                (
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    talla,
                    id_categoria
                )
             VALUES
                ($1, $2, $3, $4, $5, $6)
             RETURNING
                id_producto,
                nombre,
                descripcion,
                precio,
                stock,
                talla,
                id_categoria`,
            [
                nombre,
                descripcion || null,
                precio,
                stock,
                talla || null,
                id_categoria
            ]
        );

        res.status(201).json({
            mensaje: 'Producto agregado correctamente',
            producto: resultado.rows[0]
        });

    } catch (error) {

        console.error(
            'Error al agregar producto:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al agregar el producto'
        });
    }
};



module.exports = {
    obtenerEstadisticas,
    obtenerProductosAdmin
};


const editarProducto = async (req, res) => {

    const { id } = req.params;

    const {
        nombre,
        descripcion,
        precio,
        stock,
        talla,
        id_categoria
    } = req.body;

    if (
        !nombre?.trim() ||
        precio === undefined ||
        precio === null ||
        !Number.isFinite(Number(precio)) ||
        Number(precio) < 0 ||
        stock === undefined ||
        stock === null ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0 ||
        !Number.isInteger(Number(id_categoria)) ||
        Number(id_categoria) < 1
    ) {
        return res.status(400).json({
            mensaje: 'Verifica los datos del producto'
        });
    }

    try {

        const resultado = await pool.query(
            `UPDATE productos
             SET
                nombre = $1,
                descripcion = $2,
                precio = $3,
                stock = $4,
                talla = $5,
                id_categoria = $6
             WHERE id_producto = $7
             RETURNING *`,
            [
                nombre.trim(),
                descripcion?.trim() || null,
                Number(precio),
                Number(stock),
                talla?.trim() || null,
                Number(id_categoria),
                id
            ]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json({
            mensaje: 'Producto actualizado correctamente',
            producto: resultado.rows[0]
        });

    } catch (error) {

        console.error(
            'Error al editar producto:',
            error
        );

        res.status(500).json({
            mensaje: 'Error al actualizar el producto'
        });
    }
};


/* ELIMINAR PRODUCTO */
const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await pool.query(
            `DELETE FROM productos
             WHERE id_producto = $1
             RETURNING id_producto, nombre`,
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({
                mensaje: 'No se encontró el producto.'
            });
        }

        res.json({
            mensaje: 'Producto eliminado correctamente.',
            producto: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error);

        if (error.code === '23503') {
            return res.status(409).json({
                mensaje: 'No se puede eliminar este producto porque está relacionado con pedidos.'
            });
        }

        res.status(500).json({
            mensaje: 'Error al eliminar el producto.'
        });
    }
};

/* OBTENER TODOS LOS PEDIDOS PARA EL ADMIN */
const obtenerPedidosAdmin = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                p.id_pedido,
                p.fecha_pedido AS fecha,
                p.estado,
                p.total,
                u.nombre || ' ' || u.apellido AS cliente
            FROM pedidos p
            INNER JOIN usuarios u
                ON p.id_usuario = u.id_usuario
            ORDER BY p.fecha_pedido DESC;
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.error('Error al obtener pedidos del administrador:', error);

        res.status(500).json({
            mensaje: 'Error al obtener los pedidos'
        });
    }
};

/* OBTENER TODOS LOS USUARIOS PARA EL ADMIN */
const obtenerUsuariosAdmin = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                rol
            FROM usuarios
            ORDER BY id_usuario DESC;
        `);

        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener usuarios del administrador:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los usuarios'
        });
    }
};




module.exports = {
    obtenerEstadisticas,
    obtenerProductosAdmin,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerPedidosAdmin,
    obtenerUsuariosAdmin

};




