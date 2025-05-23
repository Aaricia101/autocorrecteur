browser.menus.create({
    id:"autocorrectext",
    title:"Auto-Correct",
    contexts:["selection"],
    icons:{
        16: "icon.svg"
    }
});

browser.menus.onClicked.addListener(async function(info, tab) {
    if(info.menuItemId == "autocorrectext") {
        browser.storage.local.set({"results": "pending"})
        browser.storage.local.set({"corrections": []})

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (rep) => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                browser.storage.local.set({"results": xhr.response})
                console.log("résultats: " + xhr.response);
            }
        };
        console.log("envoyé: " + info.selectionText);

        xhr.open('POST', 'http://localhost:8080/autocorrectext', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({
            textToCorrect: info.selectionText
        }))
    }
});


