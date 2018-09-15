let BlockBox = require('./levelSaving');
var readlineSync = require('readline-sync');

(function (){
    BlockBox.checkGenesis().then((data) => {
        if(data.success == false){
            console.log("Was not possible to detect existence of first block, we will create one...");
            genesisBlock().then((firstBlockData) =>{
                console.log(firstBlockData);
                console.log("First block created, redirecting you to menu in 4s...");
                if(firstBlockData.success == true){
                    setTimeout(function(){
                        start()
                    }, 4000);
                }
            });
        } else {
            start();
        }
    });
})();

let genesisBlock = function(){
    return new Promise((resolve) =>{
        resolve(BlockBox.addGenesisBlock().then((data) =>{
            return data;
        }));
    });
};

let start = function() {

    menu = ['Verify Genesis', 'Create a new Block', 'Check last block integrity', 'Check chain integrity',
        'Get block usin height', 'Validate Block','Get Chain Height'];
    index = readlineSync.keyInSelect(menu, 'Hello warrior, choose your weapon!');

    switch (index) {
        case 0:
            (function () {
                BlockBox.getBlockAtPosition(0).then((data) => {
                    console.log(data);
                    start();
                });
            })();
            break;
        case 1:
            (function () {
                var body = readlineSync.question('Write the body block...');
                BlockBox.createNewBlock(body).then((data) => {
                   console.log(data);
                   start();
                });
            })();
            break;
        case 2:
            (function () {
                BlockBox.getLastBlock().then((data) => {
                    console.log(data);
                    start();
                });
            })();
            break;
        case 3:
            (function () {
                BlockBox.validateChain().then((data) => {
                    console.log(JSON.stringify(data, undefined, 2));
                    start();
                });
            })();
            break;
        case 4:
            (function () {
                height = 0;
                var blockAtHeight = readlineSync.question('Choose height... [ default => 0 ]');
                height = blockAtHeight;
                BlockBox.getBlockAtPosition(height).then((data) => {
                    console.log(data);
                    start();
                });
            })();
            break;
        case 5:
            (function () {
                height = 0;
                var blockAtHeight = readlineSync.question('Choose height... [ default => 0 ]');
                height = blockAtHeight;
                BlockBox.validateBlock(height).then((data) => {
                    console.log(data);
                    start();
                });
            })();
            break;
        case 6:
            (function () {
                BlockBox.getBlockChainHeight().then((heigh) => {
                    console.log(heigh);
                    start();
                });
            })();
            break;
        default:
            console.log('saindo');
    }
};