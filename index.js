const express = require('express');
const app = express();
require('dotenv').config();
const hbs = require('express-handlebars');
const fu = require('express-fileupload');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cp = require('cookie-parser');
const { registrarUsuario, listarUsuarios, verificarUsuario, listarUsuario, borrarLogeoAnterior, buscarId_Correo, registrarLogeo, verificarLogeo } = require('./consultas.js');


app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    hbs.engine({
        defaultLayout: `main`,
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: `${__dirname}/views/partials`
    })
)

// https://stackoverflow.com/questions/41764373/how-to-register-custom-handlebars-helpers
// Se debe crear para que funcione el registerHelper
const hbsH = hbs.create({});

app.listen(3000, () => console.log("Servidor activo en http://localhost:3000"));

app.use(fu());
app.use(express.json());
app.use(cp());

app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use("/css", express.static(`${__dirname}/cliente/assets/css`));
app.use("/js", express.static(`${__dirname}/cliente/assets/js`));
app.use("/imgs", express.static(`${__dirname}/imgs`));


app.get("/", async (req, res) => {
    try {
        const resp = await listarUsuarios();
        //res.json(resp.rows);
        res.render("listado", {
            listado: resp.rows
        });
    } catch (error) {
        console.log("Error en listar:" + error)
        res.render("listado", {
            listado: []
        })
    }
    //res.render("listado");
    //res.sendFile(`${__dirname}/cliente/index.html`);
});

// https://stackoverflow.com/questions/18976274/odd-and-even-number-comparison-helper-for-handlebars
hbsH.handlebars.registerHelper('if_impar', function(conditional) {
    if((conditional % 2) == 0) {
      return false;
    } else {
      return true;
    }
});

app.get("/login", (req, res) => {
    //res.sendFile(`${__dirname}/cliente/Login.html`);
    res.render("login");
});

app.post("/login", async (req, res) => {
    console.log('/login:', req.body);
    console.log('/login navegador: ', req.headers['user-agent']);
    console.log('/login ip3: ', JSON.stringify(req.ip));
    const {correo, pass} = req.body;
    const direccion_ip = JSON.stringify(req.ip);
    const navegador = req.headers['user-agent'];
    //console.log(correo, pass);

    let validacion = true;
    let registro;
    try {
        registro = await verificarUsuario(correo, pass);
    } catch (error) {
        console.log(error)
        registro = "Error en la validación. Correo o Contraseña incorrecto."
        validacion = false
    }
     
    if (registro.rows <= 0) {
        validacion = false;
    }

    //console.log('/login registro: ', registro.rows);
    const token = jwt.sign(correo, process.env.JWT_LLAVE);

    if (validacion) {
        validacion2 = true;
        /// Buscar id de correo
        console.log("registro.rows: ", registro.rows)
        const id_correo = registro.rows[0].id;
        /// Eliminar logeo anterior
        try {
            const borraLogeo = await borrarLogeoAnterior(id_correo);
        } catch (error) {
            console.log("Error /logeo al borrar el logeo anterior", error);
            validacion2 = false;
        };

        //// Guardar en bd tabla logeos el correo, token y datos ip y navegador
        if (validacion2) {
            try {
                const registraLogeo = await registrarLogeo(id_correo, token, direccion_ip, navegador);
            } catch (error) {
                console.log("id_correo: ", id_correo);
                console.log("token: ", token);
                console.log("direccion_ip: ", direccion_ip);
                console.log("navegador: ", navegador);
                console.log("Error /logeo al registrar un nuevo logeo", error);
                validacion2 = false;
            };
        };

        if (validacion2) {
            res.cookie("skate-aut", token, {
                secure: false,
                httpOnly: true,
            });
      
        }
        
    } 

    //res.redirect("/perfil");
    res.status(201).send(
    {
        codigo: validacion? 'Exito' : 'Error',
        correo: correo
    })
    /* res.status(401).json(registro); */

});

app.get("/admin", (req, res) => {
    //res.sendFile(`${__dirname}/cliente/Admin.html`);
    res.render("admin");
});

app.get("/registro", (req, res) => {
    res.render("registro");
    //res.sendFile(`${__dirname}/cliente/registro.html`);
});

app.get("/perfil", async (req, res) => {
    //const token = req.headers.authorization
    const token = req.cookies['skate-aut'];
    console.log('/perfil Cookie: ', token);

    if(typeof token !== 'undefined'){
        jwt.verify(token, process.env.JWT_LLAVE, (error, data) => {
            if (error) {
                console.log(error)
                autorizado = false;
            } else {
                correo = data
                autorizado = true;
            }
        })
    }else{
        autorizado = false;
    }

    //// Aquí debería verificar con la BD que el token corresponda con el inicio de sesión
    /// Crear Función verificarTokenInicio(token)
    let id_correo = 0;
    let logeoVerificado = false;
    try {
        id_correo = await buscarId_Correo(correo)
    } catch (error) {
        console.log("Error al buscar el id_correo: ", error)
    }

    try {
        console.log("id_correo: ", id_correo);
        logeoVerificado = await verificarLogeo(id_correo);
    } catch (error) {
        console.log("Error al verificar el logeo en /Perfil: ", error);
    }

    try {
        registro = await listarUsuario(correo);
    } catch (error) {
        registro = {};
        console.log('/Perfil listarUsuario Error:', error)
    }
    

    console.log('/perfil Autorizado: ', registro.rows.length);

    if (registro.rows.length > 0 && logeoVerificado) {
        var p_datos = {
            p_correo: correo,
            p_nombre: registro.rows[0].nombre,
            p_experiencia: registro.rows[0].anos_experiencia,
            p_especialidad: registro.rows[0].especialidad
            }

            res.render("perfil", {
                perfil: true,
                autorizacion: autorizado,
                datos: p_datos
            });
    } else {

        res.render("login", {
            perfil: false,
            autorizacion: autorizado,
            error: "Correo o Contraseña incorrectos"

        })
        
    }

});

app.post("/registro", async (req, res) => {
    const { email, nombre, pass, exp, espec } = req.body;
    const { foto } = req.files;
    const consentimiento = req.cookies["skatepark_cookieConsentimiento"];
    const nomFoto = v4();
    const rutaFoto = `${__dirname}/imgs/${nomFoto}.jpg`
    
    let err = false
    let registro ;
    //console.log("Llega al post registro");

    if(!isEmail(email)){
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'Correo no válido'};
    };
    if(!nombre){
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'Se requiere un nombre'};
    };
    if(!pass){
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'Se requiere una contraseña'};
    };
    if(!exp){
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'De no haber experiencia, indicar 0'};
    };
    if(!espec){
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'Se requiere una especialidad'};
    };
    if(!consentimiento) {
        err = true;
        registro = {'codigo' : 'error', 'mensaje' : 'Se requiere del consentimiento de cookies'};
    };

    try {
        await foto.mv(rutaFoto);
    } catch (error) {
        err = true;
        console.log('Subida de imagen fallida', error);
        registro = {'codigo': 'error', 'mensaje' : 'Subida de imagen fallida'};
    };

    const token = jwt.sign(email, process.env.JWT_LLAVE);
    
    if(!err){
        try {
            console.log('Pasa por el registrarUsuario');
            registro = await registrarUsuario(email, nombre, pass, exp, espec, nomFoto)
            
        } catch (error) {
            err = true;
            console.log('Registro usuario fallido', error);
            registro = {'codigo': 'error', 'mensaje' : 'registro fallido'};
        }
    };
   

    if (!err){
        console.log('Llega al envío de la cookie');
        res.cookie("skate-aut", token, {
            secure: false,
            httpOnly: true,
        });
        res.status(201).send(
        {
            codigo: 'exito',
            correo: email
        })
    }else{
        res.status(401).json(registro);
    };

});


function isEmail(email){
    var emailFormat=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if(email !== '' && email.match(emailFormat)){
        return true;
    }
    else{
        return false;
    }
};