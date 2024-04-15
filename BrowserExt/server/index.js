const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json())
app.use(cors())

const spawner = require('child_process').spawn;
app.post('/autocorrectext', (req, res) => {
    var textToCorrect = req.body.textToCorrect.replace('\n', '');

    const python_process = spawner('py', [__dirname + '/algo.py', textToCorrect])
    console.log("data sent to python: " + textToCorrect);

    python_process.stdout.on('data', (data) => {
        let dataArr = data.toString().split('\n');
        let ufData = [];
        let wordData = [];
        for(let i = 0; i < dataArr.length; i++) {
            if(dataArr[i][0] !== 'L' && dataArr[i][0] !== " " && dataArr[i][0] !== "-") {
                wordData.push(dataArr[i].replaceAll(/( ){1,}/g,' ').replace('\r', ''));
            }
            if(dataArr[i][0] === "-") {
                ufData.push(wordData);
                wordData = [];
            }
        }

        console.log("data recieved from python: " + ufData)
        res.send(ufData);
    });    
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on port " + port + ".."));