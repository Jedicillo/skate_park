// Lo primero debería ser saber si tiene cookies habilitadas para este sitio.
// https://stackoverflow.com/questions/10593013/delete-cookie-by-name

const modalConsiente = new bootstrap.Modal(document.getElementById("modalConsiente"), {
    keyboard: false
});

const btnAceptaCookies = document.getElementById("aceptaCookies");
const btnNiegaCookies = document.getElementById("niegaCookies")

function revisaCookieConsentimiento () {
    const existeCookie = document.cookie.indexOf("skatepark_cookieConsentimiento");
    let consiente;
    if (existeCookie != -1) {
        console.log("Tiene la cookie");
        consiente = true;

    } else {
        console.log("No tiene la cookie");
        consiente = false;
    }

    return consiente;
};

function creaCookieConsentimiento() {
    document.cookie = "skatepark_cookieConsentimiento = true; Path=/;";
};

function borraCookieConsentimiento() {
    document.cookie = "skatepark_cookieConsentimiento; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

(()=>{
    if(!revisaCookieConsentimiento()){
        // Mostrar el modal del consentimiento //
        modalConsiente.show();
    }
})()

btnAceptaCookies.addEventListener('click', () => {
    creaCookieConsentimiento();
    modalConsiente.hide();
});