const pool = require('../config/database');

const crearPedido = async (req, res) => {
    const { id_usuario, productos } = req.body;

    if (!id_usuario || !productos || productos.length === 0) {
        return res.status(400).json({
            mensaje: 'Datos del pedido incompletos'
        });
    }

    const conexion = await pool.connect();

    try {
        await conexion.query('BEGIN');

        let total = 0;

        // Verificar productos y calcular total
        for (const item of productos) {

            const resultado = await conexion.query(
                `SELECT id_producto, precio, stock
                 FROM productos
                 WHERE id_producto = $1`,
                [item.id_producto]
            );

            if (resultado.rows.length === 0) {
                throw new Error(
                    `Producto ${item.id_producto} no existe`
                );
            }

            const producto = resultado.rows[0];

            if (producto.stock < item.cantidad) {
                throw new Error(
                    `Stock insuficiente para el producto ${item.id_producto}`
                );
            }

            total += Number(producto.precio) * item.cantidad;
        }

        // Crear pedido
        const pedido = await conexion.query(
            `INSERT INTO pedidos
                (id_usuario, estado, total)
             VALUES
                ($1, 'PENDIENTE', $2)
             RETURNING id_pedido, total`,
            [id_usuario, total]
        );

        const idPedido = pedido.rows[0].id_pedido;

        // Crear detalle y actualizar stock
        for (const item of productos) {

            const producto = await conexion.query(
                `SELECT precio
                 FROM productos
                 WHERE id_producto = $1`,
                [item.id_producto]
            );

            const precio = producto.rows[0].precio;

            await conexion.query(
                `INSERT INTO detalle_pedido
                    (id_pedido, id_producto, cantidad, precio)
                 VALUES
                    ($1, $2, $3, $4)`,
                [
                    idPedido,
                    item.id_producto,
                    item.cantidad,
                    precio
                ]
            );

            await conexion.query(
                `UPDATE productos
                 SET stock = stock - $1
                 WHERE id_producto = $2`,
                [
                    item.cantidad,
                    item.id_producto
                ]
            );
        }

        await conexion.query('COMMIT');

        res.status(201).json({
            mensaje: 'Pedido creado correctamente',
            id_pedido: idPedido,
            total: total.toFixed(2)
        });

    } catch (error) {

        await conexion.query('ROLLBACK');

        console.error('Error al crear pedido:', error);

        res.status(500).json({
            mensaje: error.message
        });

    } finally {
        conexion.release();
    }
};

module.exports = {
    crearPedido
};
