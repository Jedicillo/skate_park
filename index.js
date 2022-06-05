const express = require('express');
const app = express();
require('dotenv').config();
const hbs = require('express-handlebars');
const fu = require('express-fileupload');
const { v4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { registrarUsuario, listarUsuarios } = require('./consultas.js');


app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    hbs.engine({
        defaultLayout: `main`,
        layoutsDir: `${__dirname}/views/layouts`,
        partialsDir: `${__dirname}/views/partials`
    })
)

app.listen(3000, () => console.log("Servidor activo en http://localhost:3000"));

app.use(fu());
app.use(express.json());

app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use("/css", express.static(`${__dirname}/cliente/assets/css`));
app.use("/js", express.static(`${__dirname}/cliente/assets/js`));
app.use("/img", express.static(`${__dirname}/cliente/assets/img`));


app.get("/", (req, res) => {
    try {
        const resp = await listarUsuarios();
        //res.json(resp.rows);
        res.render("listaod", {
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

app.get("/login", (req, res) => {
    //res.sendFile(`${__dirname}/cliente/Login.html`);
    res.render("login");
});

app.get("/datos", (req, res) => {
    //res.sendFile(`${__dirname}/cliente/Datos.html`);
    res.render("datos");
});

app.get("/admin", (req, res) => {
    //res.sendFile(`${__dirname}/cliente/Admin.html`);
    res.render("admin");
});

app.get("/registro", (req, res) => {
    res.render("registro");
    //res.sendFile(`${__dirname}/cliente/registro.html`);
});

app.post("/registro", async (req, res) => {
    const { email, nombre, pass, exp, espec } = req.body;
    const { foto } = req.files;
    const nomFoto = v4();
    const rutaFoto = `${__dirname}/imgs/${nomFoto}.jpg`
    
    let err = false
    let registro ;

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
   
    //const { foto } = req.files;
    //console.log('Registro', {email, nombre, pass, exp, espec});
    //console.log('Registro Foto:', foto.name);
    res.status(err? 201 : 200).send(err? registro: {
        codigo: 'exito',
        token: token,
        rows: registro.rows
    });

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