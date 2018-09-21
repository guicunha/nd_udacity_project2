var app = require('express')()
const port = 8080
let BlockBox = require('./levelSaving');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(function (){
    BlockBox.checkGenesis().then((data) => {
        if(data.success == false){
            genesisBlock().then((firstBlockData) =>{
                if(firstBlockData.success == true){
                    setTimeout(function(){
                    }, 4000);
                }
            });
        } else {
        }
    });
})();

app.post('/block', (req, res) => {
    let body = req.body.body;
    if(body === '' || body === null) {
        let message = {error: true, message: 'You need to pass data body to create your block'};
        res.send(message)
    } else {
        BlockBox.createNewBlock(body).then((data) => {
            res.send(JSON.stringify(data, undefined, 2));
        });
    }
});

app.get('/block/:height', (req, res) => {
    BlockBox.getBlockAtPosition(req.params.height).then((data) => {
        res.send(JSON.stringify(data));
    });
});

app.get('/validate_chain', (req, res) => {
    BlockBox.validateChain().then((data) => {
        res.send(JSON.stringify(data, undefined, 2));
    });
});

let genesisBlock = function(){
    return new Promise((resolve) =>{
        resolve(BlockBox.addGenesisBlock().then((data) =>{
            return data;
        }));
    });
};

app.listen(port, () => console.log(`Example app listening on port ${port}!`))