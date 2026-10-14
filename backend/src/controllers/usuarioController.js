const pool = require('../config/database');

const registrarUsuario = async (req, res) => {
    const {
        nombre,
        apellido,
        correo,
        password
    } = req.body;

    if (!nombre || !apellido || !correo || !password) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    try {

        const usuarioExistente = await pool.query(
            `SELECT id_usuario
             FROM usuarios
             WHERE correo = $1`,
            [correo]
        );

        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        const resultado = await pool.query(
            `INSERT INTO usuarios
                (nombre, apellido, correo, password, rol)
             VALUES
                ($1, $2, $3, $4, 'CLIENTE')
             RETURNING
                id_usuario,
                nombre,
                apellido,
                correo,
                rol`,
            [
                nombre,
                apellido,
                correo,
                password
            ]
        );

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {

        console.error('Error al registrar usuario:', error);

        res.status(500).json({
            mensaje: 'Error al registrar usuario'
        });
    }
};


const iniciarSesion = async (req, res) => {

    const {
        correo,
        password
    } = req.body;

    if (!correo || !password) {
        return res.status(400).json({
            mensaje: 'Correo y contraseña son obligatorios'
        });
    }

    try {

        const resultado = await pool.query(
            `SELECT
                id_usuario,
                nombre,
                apellido,
                correo,
                password,
                rol
             FROM usuarios
             WHERE correo = $1`,
            [correo]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        const usuario = resultado.rows[0];

        if (usuario.password !== password) {
            return res.status(401).json({
                mensaje: 'Correo o contraseña incorrectos'
            });
        }

        res.json({
            mensaje: 'Inicio de sesión correcto',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {

        console.error('Error al iniciar sesión:', error);

        res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
};
module.exports = {
    registrarUsuario,
    iniciarSesion
};
