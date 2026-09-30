const express = require('express');
const cors = require('cors');

const productoRoutes = require('./routes/productoRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API de Tienda de Ropa funcionando correctamente'
    });
});

app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});