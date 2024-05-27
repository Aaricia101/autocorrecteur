let motsCorriges = [];
let dbg = "";

function addMot(motOriginal, correction) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:8080/ajoutmot', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify({
        ajoutMot: correction
    }))

    motsCorriges.push(motOriginal + ":" + correction);
    browser.storage.local.set({"corrections": motsCorriges})
    rewritePopup();
}

function ignoreMot(motOriginal) {
    motsCorriges.push(motOriginal + ":'");
    browser.storage.local.set({"corrections": motsCorriges})
    console.log("- Mot Ignoré: " + motOriginal + " -")
    rewritePopup();
}

function rewritePopup() {
    let paragraphNode = document.getElementById("paragraphNode");
    let listNode = document.getElementById("listNode");
    browser.storage.local.get(["results"]).then(res => {
        paragraphNode.innerHTML = "";
        if(res.results == "pending") {
            paragraphNode.innerHTML = "Le texte est en train d'être corrigé, fermé le popup et réesseyez dans quelques secondes..."
            listNode.innerHTML = "";
        }
        else {
            //chaque entré dans arrData correspond à un mot et ses 5 meilleurs corrections
            let arrData = JSON.parse(res.results);
            let mots = []
            for(let i = 0; i < arrData.length; i++) {
                for(let ii = 0; ii < arrData[i].length; ii++) {
                    arrData[i][ii] = arrData[i][ii].split(' ');
                }
    
                //Je sépare le mot dans sa propre array, ajustant les suggestions aux sous-index 0 à 4.
                mots.push(arrData[i][0])
                let newArrData = []
                for (let ii = 1; ii < arrData[i].length; ii++) {
                    newArrData.push(arrData[i][ii]);
                }
                arrData[i] = newArrData;
            }
    
            //Écrit le texte sous forme de phrase
            for(let i = 0; i < arrData.length; i++) {
                let node = document.createElement("span")

                let corr = "";
                for (let ii = 0; ii < motsCorriges.length && corr == ""; ii++) {
                    corr = motsCorriges[ii].split(':')[0].toString() == mots[i].toString() ? motsCorriges[ii].split(':')[1].toString() : "";
                }

                node.innerHTML = (corr == "" || corr == "'" ? mots[i] : corr) + (i+1 < arrData.length ? " " : "");

                if(arrData[i].length <= 0) {
                    node.style = "color: green";
                }
                else if (corr == "'") {
                    node.style = "color: darkseagreen";
                }
                else if (corr != "") {
                    node.style = "color: deepskyblue";
                }
                else {
                    node.style = "color: red";
                }
                paragraphNode.appendChild(node);
            }
    
            //Écrit les suggestions en une liste ordonnée.
            listNode.innerHTML = "";
            let orderedList = document.createElement("ol");
            listNode.appendChild(orderedList);

            let mistakes = [];
            for(let i = 0; i < arrData.length; i++) {
                let isInMistakes = false;
                for (let ii = 0; ii < mistakes.length && !isInMistakes; ii++) {
                    isInMistakes = mistakes[ii].toString() == mots[i].toString();
                }
                let estCorrige = false;
                for (let ii = 0; ii < motsCorriges.length && !estCorrige; ii++) {
                    estCorrige = motsCorriges[ii].split(':')[0].toString() == mots[i].toString();
                }

                if(arrData[i].length > 0 && !isInMistakes && !estCorrige) {
                    let li = document.createElement("li")
                    let node = document.createElement("span")
                    node.innerHTML = mots[i].toString();
                    node.style = "color: red";
                    li.appendChild(node)
                    mistakes.push(mots[i]);
        
                    candOrder = []
                    probOrder = []
                    while (candOrder.length != arrData[i].length) {
                        biggestCand = 0;
                        candInd = -1;
                        for(let ii = 0; ii < arrData[i].length; ii++) {
                            let d = arrData[i][ii];
                            if(!candOrder.includes(d[1])) {
                                if(parseFloat(d[2]) * parseFloat(d[3]) > biggestCand || biggestCand == 0) {
                                    biggestCand = parseFloat(d[2]) * parseFloat(d[3]);
                                    candInd = ii
                                }
                            }
                        }
    
                        if(candInd == -1) {
                            console.log("Erreur, aucun candidat trouvé: " + arrData[i]);
                        }
                        let cD = arrData[i][candInd]
                        candOrder.push(cD[1])
                        probOrder.push(parseFloat(cD[2]) * parseFloat(cD[3]))
                    }
    
                    let spanNode = document.createElement("span")
                    spanNode.append(": ");
                    for(let ii = 0; ii < candOrder.length; ii++) {
                        let buttonNode = document.createElement("button");
                        buttonNode.innerHTML = candOrder[ii];
                        buttonNode.onclick = function() { addMot(mots[i], buttonNode.innerHTML); };
                        spanNode.appendChild(buttonNode)
                        if(ii + 1 < candOrder.length) { spanNode.append(", "); }
                    }
                    spanNode.append(".")
                    spanNode.append(document.createElement("br"))
                    
                    let btnNode = document.createElement("button");
                    btnNode.innerHTML = "Ajouter au Dictionnaire";
                    btnNode.onclick = function() { addMot(mots[i], mots[i]); };
                    spanNode.appendChild(btnNode)
                    
                    spanNode.append(" — ")
    
                    let btnNode0
                    btnNode0 = document.createElement("button")
                    btnNode0.innerHTML = "Ignorer"
                    btnNode0.onclick = function() { ignoreMot(mots[i]); };
                    spanNode.appendChild(btnNode0)
                    spanNode.append(document.createElement("br"))
    
                    li.appendChild(spanNode);
                    orderedList.appendChild(li);
                }
            }
        }
    })
}

browser.storage.local.get(["corrections"]).then(res => {
    if(res.corrections != undefined) {
        motsCorriges = res.corrections;
    }
    else {
        motsCorriges = [];
    }
    console.log("corrections obtenues du stockage: " + motsCorriges.toString())
    rewritePopup();
})
//document.body.append()