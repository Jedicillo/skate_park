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

const verificarUsuario = async (correo, pass) => {
    try {
        const config = {
            text: 'Select * from public.skaters where email = $1 and "password" = $2;',
            values: [correo, pass]
        };
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log('Error al verificar usuario: ', error);
        return error;
    };
};

const listarUsuarios = async () => {
    console.log("Llega al listado de usuarios");
    try {
        const config = {
            text: "Select * from public.skaters;",
            values: []
        };
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log("Hubo un error en el listado: " + error);
        return error;
    };
};

const listarUsuario = async (correo) => {
    console.log("Llega al listado de usuarios");
    try {
        const config = {
            text: "Select * from public.skaters where email = $1;",
            values: [correo]
        };
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log("Hubo un error en el listado: " + error);
        return error;
    };
};

/*----------- LOGEOS -------------*/
const borrarLogeoAnterior = async (id_correo) => {
    console.log("Pasa por el borrar logeo");
    try {
        const config = {
            text: "Delete from public.logeos where id_correo = $1 returning *;",
            values: [id_correo]
        };
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log("Error al borrar logeo anterior");
        return error;
    };
};

const buscarId_Correo = async (correo) => {
    console.log("Pasa por el buscar id_correo");
    try {
        const config = {
            text: "Select id from public.skaters where email = $1;",
            values: [correo]
        };
        const resp = pool.query(config);
        return (await resp).rows[0].id;
    } catch (error) {
        console.log("Error al buscar el id_correo");
        return error;
    };
};

const registrarLogeo = async (id_correo, token, navegador, direccion_ip) => {
    console.log("Pasa por el registro de logeos");
    try {
        const config = {
            text: "Insert into public.logeos (id_correo, token_cliente, direccion_ip, tipo_navegador, fecha_creacion) values ($1, $2, $3, $4, default) returning *;",
            values: [id_correo, token, navegador, direccion_ip]
        };
        const resp = pool.query(config);
        return resp;
    } catch (error) {
        console.log("Error al insertar logeo: ", error);
        return error;
    };
};

const verificarLogeo = async (id_correo, token) => {
    console.log("Pasa por el verificarLogeo");
    try {
        const config = {
            text: "Select * from public.logeos Where id_correo = $1;",
            values: [id_correo]
        };
        const resp = pool.query(config);
        if ((await resp).rows.token == token) {
            respuesta = true;
        } else {
            respuesta = false;
        }
        return respuesta;
    } catch (error) {
        console.log("Error al verificar logeo en Consultas: ", error);
        return error;
    }
}

module.exports = { registrarUsuario, listarUsuarios, verificarUsuario, listarUsuario, borrarLogeoAnterior, buscarId_Correo, registrarLogeo, verificarLogeo }