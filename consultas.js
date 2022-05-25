const { Pool } = require('pg');

const pool = new Pool({
    host: PG_HOST,
    database: 'skatepark',
    port: PG_PORT,
    user: PG_USER,
    password: PG_PASS
});

const registrarUsuario = async (email, nombre, pass, exp, espec, nombreFoto) => {
    try {
        const config = {
            text: `Insert into public.skaters
            (email, nombre, "password", anos_experiencia, especialidad, foto, estado)
            values($1, $2, $3, $4, $5, $6, false) Returning *;`,
            values: [email, nombre, pass, exp, espec, nombreFoto]
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}