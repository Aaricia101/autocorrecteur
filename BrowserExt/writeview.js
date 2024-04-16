browser.storage.local.get(["results"]).then(res => {
    
    let paragraphNode = document.createElement("p");
    if(res.results == "pending") {
        paragraphNode.innerHTML = "The text is being processed..."
        document.body.appendChild(paragraphNode);
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
        document.body.appendChild(paragraphNode);
        for(let i = 0; i < arrData.length; i++) {
            let node = document.createElement("span")
            node.innerHTML = mots[i] + (i+1 < arrData.length ? " " : "");
            if(arrData[i].length <= 0) {
                node.style = "color: green";
            }
            else {
                node.style = "color: red";
            }
            paragraphNode.appendChild(node);
        }

        //Écrit les suggestions en une liste ordonnée.
        paragraphNode = document.createElement("p");
        document.body.appendChild(paragraphNode);
        let orderedList = document.createElement("ol");
        paragraphNode.appendChild(orderedList);
        for(let i = 0; i < arrData.length; i++) {
            if(arrData[i].length > 0) {
                let li = document.createElement("li")
                let node = document.createElement("span")
                node.innerHTML = mots[i];
                node.style = "color: red";
                li.appendChild(node)
    
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
                    console.log("hullo " + candInd + " " + biggestCand);

                    if(candInd == -1) {
                        console.log(arrData[i]);
                    }
                    let cD = arrData[i][candInd]
                    candOrder.push(cD[1])
                    probOrder.push(parseFloat(cD[2]) * parseFloat(cD[3]))
                }
                console.log(candOrder);
                console.log(probOrder);

                let spanNode = document.createElement("span")
                let str = ": "
                for(let ii = 0; ii < candOrder.length; ii++) {
                    //if(probOrder[ii] >= 0.01) {
                        str += candOrder[ii]//+ " (" + Math.round(probOrder[ii] * 100) + "%), "
                        if(ii + 1 < candOrder.length) { str += ", " }
                    /*}
                    else if(ii == 0) {
                        li.appendChild(node);
                        node = document.createElement("span")
                        node.innerHTML += "Unknown."
                        node.style = "color: #696969"
                        break;
                    }
                    else {
                        break;
                    }*/
                }
                spanNode.innerHTML = str;
                li.appendChild(spanNode);
                orderedList.appendChild(li);
            }
        }
    }
})
//document.body.append()