const express = require('express');
const app = express();
const { Pool } = require('pg');
const hbs = require('express-handlebars');

app.listen(3000, () => console.log("Servidor activo en http://localhost:3000"));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/login", (req, res) => {
    res.sendFile(`${__dirname}/Login.html`);
});

app.get("/datos", (req, res) => {
    res.sendFile(`${__dirname}/Datos.html`);
});

app.get("/admin", (req, res) => {
    res.sendFile(`${__dirname}/Admin.html`);
});

app.get("/registro", (req, res) => {
    res.sendFile(`${__dirname}/Registro.html`);
});