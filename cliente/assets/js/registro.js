const formulario = document.getElementById('formulario');
const btnRegistro = document.getElementById('btnRegistro');
const txtEmail = document.getElementById('txtEmail');
const txtNombre = document.getElementById('txtNombre');
const txtPass = document.getElementById('txtPass');
const txtPass2 = document.getElementById('txtPass2');
const txtExp = document.getElementById('txtExp');
const txtEspec = document.getElementById('txtEspec');
const fotoPerfil = document.getElementById('fotoPerfil');

const faltaEmail = document.getElementById('faltaEmail');
const faltaNombre = document.getElementById('faltaNombre');
const faltaPass = document.getElementById('faltaPass');
const faltaPass2 = document.getElementById('faltaPass2');
const faltaExp = document.getElementById('faltaExp');
const faltaEspec = document.getElementById('faltaEspec');
const faltaFoto = document.getElementById('faltaFoto');

//const modalExito = document.getElementById('modalExito');
const modalExito = new bootstrap.Modal(document.getElementById('modalExito'), {
    keyboard: false
  })
  

btnRegistro.addEventListener('click', async (e) => {
    e.preventDefault();
    let falta = false;
    
    const email = txtEmail.value;
    const nombre = txtNombre.value;
    const password = txtPass.value;
    const password2 = txtPass2.value;
    const experiencia = txtExp.value;
    const especialidad = txtEspec.value;
    const foto = fotoPerfil.files[0];

    if (!isEmail(email)) {
        falta = true;
        faltaEmail.innerText = "Formato de correo incorrecto";
    }else faltaEmail.innerHTML = "&nbsp;";

    if(nombre == '') {
        falta = true;
        faltaNombre.innerText = "Falta nombre";
    } else faltaNombre.innerHTML = "&nbsp;";

    if(password.length < 4) {
        falta = true;
        faltaPass.innerText = "Falta una contraseña. Debe ser mayor a 4 caracteres";
    } else faltaPass.innerHTML = "&nbsp;";

    if(password != password2) {
        falta = true;
        faltaPass2.innerText = "Contraseñas no coinciden";
    } else faltaPass2.innerHTML = "&nbsp;";

    if(experiencia == '') {
        falta = true;
        faltaExp.innerText = "Falta experiencia";
    } else faltaExp.innerHTML = "&nbsp;";

    if(especialidad == '') {
        falta = true;
        faltaEspec.innerText = "Falta especialidad";
    } else faltaEspec.innerHTML = "&nbsp;";

    if(!foto) {
        falta = true;
        faltaFoto.innerText = "Falta una foto de perfil";
    } else faltaFoto.innerHTML = "&nbsp;";
    
    if(!falta){
        let registrado = await registrarUsuario(email, nombre, password, experiencia, especialidad, foto);
        //console.log('Después del await');
        if(registrado){
            console.log(registrado);
            modalExito.show();
        }else {
            console.log('No se ha registrado');
        }
    };
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
    .then(resp => resp);
    
    return registro;
};


//https://stackoverflow.com/questions/60737672/email-regex-pattern-in-nodejs
function isEmail(email){
    var emailFormat=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if(email !== '' && email.match(emailFormat)){
        return true;
    }
    else{
        return false;
    }
};