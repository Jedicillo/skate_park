const express = require('express');
const app = express();
const { Pool } = require('pg');
const hbs = require('express-handlebars');
const fu = require('express-fileupload');

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

app.post("/registro", (req, res) => {
    const { email, nombre, pass, exp, espec } = req.body;
    const { foto } = req.files;
    //const { foto } = req.files;
    console.log('Registro', {email, nombre, pass, exp, espec});
    console.log('Registro Foto:', foto.name);
    res.json({ 'mensaje': 'exito'})
});