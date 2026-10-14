const express = require('express');
const router = express.Router();

const {
    crearPedido,
    obtenerPedidosPorUsuario
} = require('../controllers/pedidoController');

router.post('/', crearPedido);
router.get(
    '/usuario/:id_usuario',
     obtenerPedidosPorUsuario
    );

module.exports = router;