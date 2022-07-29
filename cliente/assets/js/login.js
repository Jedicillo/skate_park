const inpCorreo = document.getElementById("logeoCorreo");
const inpPass = document.getElementById("logeoPass");
const btnAcceder = document.getElementById("acceder");

const faltaConsent = document.getElementById("faltaConsent")


acceder.addEventListener('click', async (e) => {
    e.preventDefault();

    if(!revisaCookieConsentimiento()){
        falta = true;
        faltaConsent.innerText = "Falta el consentimiento de cookies";
    } else faltaConsent.innerHTML  ="&nbsp;";
    
    let correo = inpCorreo.value;
    let pass = inpPass.value;

    let registrado = await usuarioRegistrado(correo, pass);
    console.log(registrado);

    if (registrado.codigo == 'exito') {
        console.log('Usuario Registrado');
        window.location.href ="/perfil"
    } else {
        console.log('Usuario no Existe o Contraseña incorrecta');
    };

});

const usuarioRegistrado = (correo, pass) => {
    const fd = new FormData();

    fd.append('correo', correo);
    fd.append('pass', pass);

    const registro = fetch("/login", {
        method: "POST",
        body: fd
    })
    .then(resp => resp.json())
    .catch(error => console.log('Error: ', error))
    .then(res => res)
    
    return registro;
};