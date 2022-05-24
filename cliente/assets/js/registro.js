const formulario = document.getElementById('formulario');
const btnRegistro = document.getElementById('btnRegistro');
const txtEmail = document.getElementById('txtEmail');
const txtNombre = document.getElementById('txtNombre');
const txtPass = document.getElementById('txtPass');
const txtPass2 = document.getElementById('txtPass2');
const txtExp = document.getElementById('txtExp');
const txtEspec = document.getElementById('txtEspec');
const fotoPerfil = document.getElementById('fotoPerfil');


btnRegistro.addEventListener('click', async (e) => {
    //e.preventDefault();
    console.log('Entra al click del registro');
    const email = txtEmail.value;
    const nombre = txtNombre.value;
    const password = txtPass.value;
    const experiencia = txtExp.value;
    const especialidad = txtEspec.value;
    const foto = fotoPerfil.files[0];

    let registrado = await registrarUsuario(email, nombre, password, experiencia, especialidad, foto);
    

});


const registrarUsuario = (email, nombre, pass, exp, espec, foto) => {
    const fd = new FormData();
    fd.append('email', email);
    fd.append('nombre', nombre);
    fd.append('pass', pass)
    fd.append('exp', exp)
    fd.append('espec', espec)
    fd.append('foto', foto)

    const registro = fetch("/registro", {
        method: "POST",
        //headers: {"Content-Type" : "multipart/form-data"},
        //headers: {"Content-Type" : "application/json"},
        //Sin Header para que el navegador agrege el boundary
        // https://muffinman.io/blog/uploading-files-using-fetch-multipart-form-data/
        body: fd
    })
    .then(res => res.json())
    .catch(error => console.log('Error: ', error))
    .then(resp => {
        console.log('Exito', resp);
        if(resp){
            console.log('Registro exitoso', resp.mensaje);
        }
        return resp;
    });

};