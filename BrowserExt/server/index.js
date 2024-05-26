const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json())
app.use(cors())

const spawner = require('child_process').spawn;
app.post('/autocorrectext', (req, res) => {
    var textToCorrect = req.body.textToCorrect.replace('\n', '').replaceAll('’', '\'');

    const python_process = spawner('py', [__dirname + '/algo.py', textToCorrect])
    console.log("data sent to python: " + textToCorrect);

    python_process.stdout.on('data', (data) => {
        let dataArr = data.toString().split('\n');
        console.log("data recieved from python: " + data.toString())
        let ufData = [];
        let wordData = [];
        for(let i = 0; i < dataArr.length; i++) {
            if(dataArr[i][0] !== 'L' && dataArr[i][0] !== " " && dataArr[i][0] !== "-") {
                wordData.push(dataArr[i].replaceAll(/( ){1,}/g,' ').replace('\r', '').replace(':', ''));
            }
            if(dataArr[i][0] === "-") {
                ufData.push(wordData);
                wordData = [];
            }
        }

        try {
            res.send(ufData);
        }
        catch(e) {}
    });    
});

app.post('/ajoutmot', (req, res) => {
    console.log("----------------------------")
    console.log("- " + req.body.ajoutMot + " -")
    console.log("----------------------------")
    var nouvMot = req.body.ajoutMot.toString().replace('\n', '').replaceAll('’', '\'');

    fs.appendFile("./server/newWords.txt", "\n" + nouvMot, function(err, result) {
        //if(err) { console.log('error', err); }
      }
    );
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on port " + port + ".."));