
// Récupération du formulaire de réservation
let formResa = document.querySelector("#form-reservation");
let nom = formResa.querySelector("#nom");
nom.addEventListener("change",()=>{
    testNomPrenom(nom)
})
let prenom = formResa.querySelector("#prenom");
prenom.addEventListener("change",()=>{
    testNomPrenom(prenom)
})
let num = formResa.querySelector("#num");
num.addEventListener("change",testNum)
let rue = formResa.querySelector("#rue");
rue.addEventListener("change",testRue)
let cp = formResa.querySelector("#cp");
cp.addEventListener("change",testCp)
let ville = formResa.querySelector("#ville");
ville.addEventListener("change",testVille)
let email = formResa.querySelector("#email");
email.addEventListener("change",testEmail)
let tel = formResa.querySelector("#tel");
tel.addEventListener("change",testTel)
let chambre = formResa.querySelector("#chambre");
chambre.addEventListener("change",testChambre)
let nbr = formResa.querySelector("#nbr")
nbr.addEventListener("change",testNbr)
let arrive = formResa.querySelector("#arrive")
let depart = formResa.querySelector("#depart")
arrive.addEventListener("change",()=>{
    testDate(arrive)
})
depart.addEventListener("change",()=>{
    testDate(depart)
})


//on surveille le bouton de soumission pour lancer la fonction recap info
let validForm = formResa.querySelector("#valid-form")
formResa.addEventListener("submit", (e)=>{
    e.preventDefault()
    if(batterieTest()===true){
        recapInfos();
    } 
})
// affiche les chambres en fonction de l'hotel sélectionné
let hotel = formResa.querySelector("#hotel")
hotel.addEventListener("change",(e)=>{
    testHotel()
    if(hotel.selectedOptions[0].value==="hotel feu"){
        formResa.querySelector("option[value='igloos']").classList.remove("none")
        formResa.querySelector("option[value='laponie']").classList.remove("none")
    }
})
// retourne le prix de la chambre en fonction de la chambre selectionné
function prixChambre(chambre){
    if(chambre === "igloos"){
        return 500
    }else if(chambre==="laponie"){
        return 850
    }
}
//calcul le npombre de jour sur place en fonction de la date d'arrivé et de la date de départ
function calcNbJour(arrive,depart){
    let tabArrive = arrive.split("-")
    let tabDepart = depart.split("-")
    return tabDepart[2]-tabArrive[2]
}

/** fonction affichage des infos chauffeur
 * @param {boolean} chauffeur 
 * @param {number} prixChauffeur 
 * @returns {string}
 */
function calcChauffeur(chauffeur, prixChauffeur){
    if(chauffeur===true){
        return `oui soit ${prixChauffeur} €`
    }else{
        return  "non"
    }
}
/** fonction affichage des infos dej
 * @param {boolean} dej 
 * @param {number} prixDej
 * @returns {string}
 */
function calcDej(dej, prixDej){
    if(dej===true){
        return `oui soit ${prixDej} €`
    }else{
        return  "non"
    }
}
//recup des infos repas
let dej = formResa.querySelector("#dej");
let midi = formResa.querySelector("#midi");
let soir = formResa.querySelector("#soir");
let ponctuel = formResa.querySelector("#ponctuel");
let repasChecked = formResa.querySelector(".repas-checked")
// Si dej ou repas coché, j'affiche les regime spé et allergie
function afficheRegimAllergie(){
    dej.addEventListener("change", ()=>{
        testRepas()
    })
    midi.addEventListener("change", (e)=>{
        repasSelect(midi)
        testRepas()
    })
    soir.addEventListener("change", (e)=>{
        repasSelect(soir)
        testRepas()
    })
    ponctuel.addEventListener("change", (e)=>{
        repasSelect(ponctuel)
        testRepas()
    })  
    //lance fonction autre allergie
    afficheAutresAllergies()  
}
// si ponctuel coché, midi et soir décoché, et in versement si midi ou soir coché, ponctuel décoché
function repasSelect(e){
    if(e===ponctuel){
        midi.checked = false
        soir.checked = false
    }else{
        ponctuel.checked=false
    }
}
// test les case repas et dej si l'un est coché, on supprime le display none sur regime/allergie, et si tout est décoché on le remet
function testRepas(){
    if(dej.checked===true || midi.checked===true  || soir.checked===true  || ponctuel.checked===true){
        repasChecked.classList.remove("none");
    }else if(dej.checked===false && midi.checked===false && soir.checked===false && ponctuel.checked===false){
        repasChecked.classList.add("none");
    }
}
/** 
 * @param {boolean} midi 
 * @param {boolean} soir
 * @param {boolean} ponctuel  
 * @param {number} prixRepas
 * return {string}
 */
function calcRepas(midi, soir, ponctuel, prixRepas){
    if(midi.checked===true && soir.checked===true){
        prixRepas = prixRepas*2
        return `Midi(oui), Soir(oui), soit ${prixRepas}€`
    }else if(midi.checked===true && soir.checked===false){
        return `Midi(oui), Soir(non), soit ${prixRepas}€`
    }else if(midi.checked===false && soir.checked===true){
        return `Midi(non), Soir(oui), soit ${prixRepas}€`
    }else if(midi.checked===false && soir.checked===false && ponctuel.checked===false){
        return `Midi(non), Soir(non), Ponctuel(non)*`
    }else if(ponctuel.checked===true){
        return `Midi(non), Soir(non), Ponctuel(oui)*`
    }
}

// recup infos autres allergie
let autres = formResa.querySelector("#autres");
let autresDetails = formResa.querySelector("#autres-details")
// fonction qui affiche ou efface la case autres allergies si clic sur autre
function afficheAutresAllergies(){
    autres.addEventListener("change", ()=>{
        autresDetails.classList.toggle("none");
    })
}
afficheRegimAllergie()

// recup la zone à afficher pour le recap
let recapResa = document.querySelector(".recap-resa")

function recapInfos(){
    // récupération de toutes les valeurs du formulaire
    let a = arrive.valueAsDate
    let d = depart.valueAsDate
    let chauffeur = formResa.querySelector("#chauffeur");
    let visite = formResa.querySelector("#visite");
    let regime = formResa.querySelector("input[name='regime']");
    let gluten = formResa.querySelector("#gluten").checked;
    let lactose = formResa.querySelector("#lactose").checked;
    // calcul des infos
    let nbJour = (d-a)/(1000*60*60*24)
    let chPrix = prixChambre(chambre.value)
    let prixHorsOption = chPrix*nbJour
    let prixChauffeur = chauffeur.checked ? nbJour*chauffeur.value : 0
    let prixVisite = visite.checked ? visite.value*nbr.value : 0
    let prixDej = dej.checked ? nbJour*nbr.value*dej.value : 0
    let prixMidi = midi.checked ? nbJour*nbr.value*midi.value : 0
    let prixSoir = soir.checked ? nbJour*nbr.value*soir.value : 0
    let prixRepas = prixMidi + prixSoir
    let allergeneGluten = gluten ? "oui" : "non"
    let allergeneLactose = lactose ? "oui" : "non"
    let allergeneAutres = autres.checked ? autresDetails.value : "non"
    let prixOptions = prixChauffeur + prixVisite + prixDej + prixRepas
    let prixSejour = prixHorsOption + prixOptions
    // on affiche le recap  
    recapResa.classList.remove("none")
    // on ajoute le html dans la zone recap
    recapResa.innerHTML = `<div>
    <div>
        <h3>Récapitulatif de votre réservation</h3>
        <h4 class="mt16">Informations personnelles</h4>
        <div class="flex small-column">
            <p class="mt8 mr40">Nom: ${nom.value}</p>
            <p class="mt8">Prénom: ${prenom.value}</p>
        </div>
        <p class="mt8">Adresse de facturation: ${num.value} ${rue.value}, ${cp.value} ${ville.value}</p>
        <div class="flex small-column">
            <p class="mt8 mr40">Email: ${email.value}</p>
            <p class="mt8">Tél.: ${tel.value}</p>
        </div>
        <h4 class="mt16">Informations de réservations</h4>
        <div class="flex small-column">
            <p class="mt8 mr40">Hotel: ${hotel.value}</p>
            <p class="mt8">Chambre: ${chambre.selectedOptions[0].value} (${chPrix}€/jour)</p>
        </div>
        <div class="flex small-column">
            <p class="mt8 mr40">Date d'arrivé: ${a.toLocaleDateString()}</p>
            <p class="mt8">Date de départ: ${d.toLocaleDateString()}</p>
        </div>
        <div class="flex small-column">
            <p class="mt8 mr40">Nombre de personnes: ${nbr.value}</p>
            <p class="mt8">Nombre de jour: ${nbJour}</p>
        </div>
        <h5 class="mt8">Montant de votre séjour hors options: ${prixHorsOption} €</h5>
        <h4 class="mt16">Options et services supplémentaires</h4>
        <p class="mt8">Chauffeur (11€/jour): ${prixChauffeur}€</p>
        <p class="mt8">Visite guidée du domaine et du parc naturel alentour (20€/personne): ${prixVisite}€</p>
        <p class="mt8">Petit déjeuner (15€/personne/jour soir montant sur séjour): ${prixDej}€</p>
        <div class="flex">
            <p class="mt8 mr40">Repas (25€/personne/jour): ${prixRepas}€</p>
        </div>
        <p class="mt8">*: Pour les repas ponctuels, le prix du repas n'est pas comptabilisé dans la réservation et sera dû directement auprès du service de restauration, merci de prévenir la veille</p>
        <p class="mt8">Régime spécifique: ${regime.id}</p>
        <p class="mt8">Allergies ou intolérance alimentaire: Gluten-${allergeneGluten}, Lactose-${allergeneLactose}, Autres-${allergeneAutres}</p>
        <h5 class="mt16">Montant total de vos options: ${prixOptions}€</h5>
        <h3 class="mt16 mb32">Montant total de votre séjour: ${prixSejour}€</h3>
    </div>
    <div class="small-column container-btn-resa flex justifty-center mt16">
        <button id="paiement" class="btn-small mr40">Confirmer et passer au paiement</button>
        <button id="annule" class="btn-nobg bt">Annuler la réservation</button>
    </div>
</div>`;
noResa()
}
// fonction bouton annulation résa
function noResa(){
    // recup le bouton annule
    let annuleResa = document.querySelector("#annule")
    //surveille le bouton annule au click
    annuleResa.addEventListener("click", (e)=>{
    recapResa.classList.add("none")
})
}

function batterieTest(){
    let test1 = testNomPrenom(nom)
    let test2 = testNomPrenom(prenom)
    let test3 = testNum()
    let test4 = testRue()   
    let test5 = testCp()
    let test6 = testVille()
    let test7 = testEmail()
    let test8 = testTel()
    let test9 = testHotel()
    let test10 = testChambre()
    let test11 = testNbr()
    let test12 = testDate(arrive)
    let test13 = testDate(depart)
    let test14 = testDuree()
    if(test1 === false || test2 === false || test3 === false || test4 === false || test5 === false || test6 === false || test7 === false || test8 === false || test9 === false || test10 === false || test11 === false || test12 === false || test13 === false || test14 === false){
        return false
    }else if(test1 === true && test2 === true && test3 === true && test4 === true && test5 === true && test6 === true && test7 === true && test8 === true && test9 === true && test10 === true && test11 === true && test12 === true && test13 === true && test14 === true){
        return true
    }
}
/**
 * test que le champ soit rempli, que les bons caractère soient utilisé, qu'il n'y ai pas de code et que la longueur soit correcte
 * @param {string} id de ll'input interrogé
 * @returns true/false
 */
function testNomPrenom(input){
    // création variable reg qui indique les caractère autorisé
    let reg = /^[a-zA-ZÀ-ÿ'-]+(?:\s[a-zA-ZÀ-ÿ'-]+)*$/
    if(input.value===""){
        // zone vide affiche erreur et bordure
        afficheErreur(input.id,"Ce champ ne peux pas être vide")
        return false
    }else{
        if(reg.test(input.value)===false){
            // on test si l'utilisateur utilise les bons caractères
            afficheErreur(input.id,"Ce champ comporte des caractères non autorisés")
            return false
        }else if(input.value.length < 2 || input.value.length > 50){
            // on test la longueur du mot
            afficheErreur(input.id,`le nombre de carctère doit être compris entre 2 et 50`)
            return false
        }
        enleveErreur(input.id)
        return true
    } 
}
/**
 * test que le num soit compris entre 1 et 10 caractere et affiche msg en fonction
 * @returns true/false
 */
function testNum(){
    let reg = /^[0-9a-zA-Z\s\-',./()]+$/
    if(num.value===""){
        // zone vide affiche erreur et bordure
        afficheErreur("num","Ce champ ne peux pas être vide")
        return false
    }else if(reg.test(num.value)===false){
        // zone vide affiche erreur et bordure
        afficheErreur("num","Ce champ comporte des caractères non autorisés")
        return false
    }else if(num.value.length > 10){
        // on test la longueur du mot
        afficheErreur("num",`le nombre de carctère doit être compris entre 1 et 10`)
        return false
    }
    enleveErreur("num")
    return true
}
/**
 * 
 * @returns fonction test de la rue
 */
function testRue(){
    let reg = /^[a-zA-Z0-9\s\-',./()]+$/
    if(rue.value===""){
        afficheErreur("rue","Ce champ ne peux pas être vide")
        return false
    }else if(reg.test(rue.value)===false){
        // zone vide affiche erreur et bordure
        afficheErreur("rue","Ce champ comporte des caractères non autorisés")
        return false
    }else if(rue.value.length > 150){
        // on test la longueur du mot
        afficheErreur("rue",`le nombre de carctère doit être compris entre 1 et 10`)
        return false
    }
    enleveErreur("rue")
    return true
}
/**
 * 
 * @returns 
 */
function testCp(){
    let reg = /^[0-9]+$/
    if(cp.value===""){
        // zone vide affiche erreur et bordure
        afficheErreur("cp","Ce champ ne peux pas être vide")
        return false
    }else if(reg.test(cp.value)===false){
        // zone vide affiche erreur et bordure
        afficheErreur("cp","Ce champ comporte des caractères non autorisés")
        return false
    }else if(cp.value.length > 5){
        // on test la longueur du mot
        afficheErreur("cp",`le code postal ne peut pas comporter plus de 5 chiffres`)
        return false
    }
    enleveErreur("cp")
    return true
}
/**
 * 
 * @returns 
 */
function testVille(){
    let reg = /^[a-zA-ZÀ-ÿ0-9\s\-',./()]+$/
    if(ville.value===""){
        afficheErreur("ville","Ce champ ne peux pas être vide")
        return false
    }else if(reg.test(ville.value)===false){
        // zone vide affiche erreur et bordure
        afficheErreur("ville","Ce champ comporte des caractères non autorisés")
        return false
    }else if(ville.value.length > 100){
        // on test la longueur du mot
        afficheErreur("ville",`le nombre de carctère doit être compris entre 1 et 10`)
        return false
    }
    enleveErreur("ville")
    return true
}
/**
 * test que le champ soit rempli, que les bons caractère soient utilisé, qu'il n'y ai pas de code et que la longueur soit correcte
 * @param {string} id de ll'input interrogé
 * @returns true/false
 */
function testEmail(){
    // création variable reg qui indique les caractère autorisé
    let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(email.value===""){
        // zone vide affiche erreur et bordure
        afficheErreur("email","Ce champ ne peux pas être vide")
        return false
    }else{
        if(reg.test(email.value)===false){
            // on test si l'utilisateur utilise les bons caractères
            afficheErreur("email","Ce champ comporte des caractères non autorisés")
            return false
        }else if(email.value.length > 100){
            // on test la longueur du mot
            afficheErreur("email",`le nombre de carctère doit être compris entre 2 et 50`)
            return false
        }
        enleveErreur("email")
        return true
    } 
}
/**
 * 
 * @returns 
 */
function testTel(){
    let reg = /^[0-9\s\-.,_/']+$/
    let regFormat = /[\s\-.,_/']/
    if(tel.value===""){
        afficheErreur("tel","Ce champ ne peux pas être vide")
        return false
    }else if(reg.test(tel.value)===false){
        afficheErreur("tel","Ce champ comporte des caractères non autorisés")
        return false
    }else if(regFormat.test(tel.value)===true && tel.value.length < 14 || regFormat.test(tel.value)===false && tel.value.length < 10){
        afficheErreur("tel", `le numéro de téléphone est incomplet`)
        return false
    }else if(regFormat.test(tel.value)===true && tel.value.length > 14 || regFormat.test(tel.value)===false && tel.value.length > 10){
        afficheErreur("tel", `le numéro de téléphone est trop long`)
        return false
    }
    enleveErreur("tel")
    return true
}
/**
 * 
 * @returns 
 */
function testHotel(){
    if(hotel.value===""){
        afficheErreur("hotel","veuillez choisir un hotel")
        return false
    }else{
        enleveErreur("hotel")
        return true
    }
}
/**
 * 
 * @returns 
 */
function testChambre(){
    if(chambre.value===""){
        afficheErreur("chambre","veuillez choisir une chambre")
        return false
    }else{
        enleveErreur("chambre")
        return true
    }
}
/**
 * 
 * @returns 
 */
function testNbr(){
    if(nbr.value===""){
        afficheErreur("nbr","veuillez indiquer si vous serez seul ou accompagné")
        return false
    }else if(nbr.value<1 || nbr.value>2){
        afficheErreur("nbr","vous ne pouvez réserver que pour 1 ou 2 personnes")
        return false
    }
    enleveErreur("nbr")
        return true
}
/**
 * 
 * @param {*} date 
 * @returns 
 */
function testDate(date){
    if(date.value===""){
        afficheErreur(date.id,"Veuillez sélectionner une date")
        return false
    }else{
        enleveErreur(date.id)
        return true
    }
}
/**
 * 
 * @returns 
 */
function testDuree(){
    let dateJour = new Date()
    let a = arrive.valueAsDate
    let d = depart.valueAsDate
    let nbJour = (d-a)/(1000*60*60*24)
    let DJ = (a-dateJour)/(1000*60*60*24)
    if(DJ<=7){
        afficheErreur("arrive","vous ne pouvez effectuer une réservation moins de 7 jours à l'avance")
        return false
    }else if(nbJour<=0){
        afficheErreur("depart","la date de départ ne peut être inférieur à la date d'arrivée")
        return false
    }else{
        enleveErreur("depart")
        return true
    }
}




/** 
 * cherche dans une chaine de caractère s'il y a une balise script
 * @param {string} text * la chaine de caractère testé 
 * @return true: il y a du code / false: il n'y a pas de code
 *  Test unitaire OK
 */
function hasCode(text){
    let reg = /<script/
    return reg.test(text)
}
/** 
 * on affiche une bordure rouge sur l'input qui remonte une erreur et remplir le message d'erreur associé
 * @param {id} id * id de l'erreur dans lequel il y a une erreur 
 * @param {string} msgErr * le mesage à afficher
 * @return rien
 *  Test unitaire OK
 */
function afficheErreur(id,msgErr){
    let input = document.getElementById(id)
    input.classList.add("champ-error")
    let p = document.getElementById("error-"+id)
    p.innerText = msgErr
    p.classList.remove("none")
}
/** 
 * enlève l'erreur sur l'input et cache le paragraphe associé
 * @param {*} id * id de l'input qui n'est plus en ereur
 * @return rien
 *  Test unitaire OK
 */
function enleveErreur(id){
    let input = document.getElementById(id)
    input.classList.remove("champ-error")
    let p = document.getElementById("error-"+id)
    p.innerText = ""
    p.classList.add("none")
}