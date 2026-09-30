const pool = require('../config/database');

const obtenerProductos = async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                p.id_producto,
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
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los productos'
        });
    }
};

module.exports = {
    obtenerProductos
};