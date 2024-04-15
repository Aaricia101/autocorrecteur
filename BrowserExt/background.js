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
        let textToCorrect = info.selectionText;
        browser.storage.local.set({"text": info.selectionText})
        browser.storage.local.set({"results": "pending"})

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = (rep) => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                browser.storage.local.set({"results": xhr.response})
            }
        };

        xhr.open('POST', 'http://localhost:8080/autocorrectext', true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        console.log("Called with success");
        xhr.send(JSON.stringify({
            textToCorrect: textToCorrect
        }))
    }
});

