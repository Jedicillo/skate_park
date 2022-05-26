const express = require('express');
const app = express();
require('dotenv').config();
const hbs = require('express-handlebars');
const fu = require('express-fileupload');
const { v4 } = require('uuid');
const { registrarUsuario } = require('./consultas.js');

app.listen(3000, () => console.log("Servidor activo en http://localhost:3000"));

app.use(fu());
app.use(express.json());

app.use("/bootstrap", express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use("/css", express.static(`${__dirname}/cliente/assets/css`));
app.use("/js", express.static(`${__dirname}/cliente/assets/js`));
app.use("/img", express.static(`${__dirname}/cliente/assets/img`));


app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/cliente/index.html`);
});

app.get("/login", (req, res) => {
    res.sendFile(`${__dirname}/cliente/Login.html`);
});

app.get("/datos", (req, res) => {
    res.sendFile(`${__dirname}/cliente/Datos.html`);
});

app.get("/admin", (req, res) => {
    res.sendFile(`${__dirname}/cliente/Admin.html`);
});

app.get("/registro", (req, res) => {
    res.sendFile(`${__dirname}/cliente/Registro.html`);
});

app.post("/registro", async (req, res) => {
    const { email, nombre, pass, exp, espec } = req.body;
    const { foto } = req.files;
    const nomFoto = v4();
    const rutaFoto = `${__dirname}/imgs/${nomFoto}.jpg`
    
    let err = false
    let registro ;

    try {
        await foto.mv(rutaFoto);
    } catch (error) {
        err = true;
        console.log('Subida de imagen fallida', error);
        registro = {'rows': [{'mensaje' : 'Subida de imagen fallida'}]};
    };

    if(!err){
        try {
            console.log('Pasa por el registrarUsuario');
            registro = await registrarUsuario(email, nombre, pass, exp, espec, nomFoto)
        } catch (error) {
            err = true;
            console.log('Registro usuario fallido', error);
            registro = {'rows': [{'mensaje' : 'registro fallido'}, {'error' : error}]};
        }
    };
   
    //const { foto } = req.files;
    //console.log('Registro', {email, nombre, pass, exp, espec});
    //console.log('Registro Foto:', foto.name);
    res.status(err? 401 : 200).send(registro.rows);

});
