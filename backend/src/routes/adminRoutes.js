const express = require('express');

const router = express.Router();

const {
    obtenerEstadisticas,
    obtenerProductosAdmin,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    obtenerPedidosAdmin,
    obtenerUsuariosAdmin
} = require('../controllers/adminController');


router.get(
    '/estadisticas',
    obtenerEstadisticas
);


router.get(
    '/productos',
    obtenerProductosAdmin
);


router.post(
    '/productos',
    agregarProducto
);


router.put(
    '/productos/:id',
    editarProducto
);

router.delete(
    '/productos/:id',
    eliminarProducto
);

router.get(
    '/pedidos',
    obtenerPedidosAdmin
);

router.get(
    '/usuarios',
    obtenerUsuariosAdmin
);

module.exports = router;
