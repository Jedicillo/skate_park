const nbPerfil = document.getElementById("nbPerfil");


nbPerfil.addEventListener('click', (evento) => {
    evento.preventDefault();
    const token = localStorage.getItem('skate-aut');
    //console.log('Token: ', token)
    const encabeza = new Headers({
        'Content-Type' : 'application/json',
        'Authorization' : token
    })

    const autoriza = fetch("/perfil", {
        method: "GET",
        headers: encabeza
    })
    .then(resp => resp)
    .catch(error => console.log("Error: ", error))

});