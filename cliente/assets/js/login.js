const nombre = document.getElementById("logeoNombre");
const pass = document.getElementById("logeoPass");
const acceder = document.getElementById("acceder");

const faltaConsent = document.getElementById("faltaConsent")


acceder.addEventListener('click', (e) => {
    e.preventDefault();

    if(!revisaCookieConsentimiento()){
        falta = true;
        faltaConsent.innerText = "Falta el consentimiento de cookies";
    } else faltaConsent.innerHTML  ="&nbsp;";
    
    


});