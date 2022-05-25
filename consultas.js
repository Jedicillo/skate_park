const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PG_HOST,
    database: 'skatepark',
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASS
});

const registrarUsuario = async (email, nombre, pass, exp, espec, nombreFoto) => {
    console.log('Llega al registrar usuario');
    try {
        const config = {
            text: `Insert into public.skaters
            (email, nombre, "password", anos_experiencia, especialidad, foto, estado)
            values($1, $2, $3, $4, $5, $6, false) Returning *;`,
            values: [email, nombre, pass, exp, espec, nombreFoto]
        }
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log('Hubo un error', error);
        return error;
    }
};


module.exports = { registrarUsuario }