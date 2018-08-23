let BlockBox = require('./levelSaving');
var readlineSync = require('readline-sync');
let Block = require('./block');


class Blockchain {

    constructor() {
    }


    addBlock(newBlock) {

        BlockBox.getLastBlock().then((data) => {

            console.log(data);

            let lastBlock = data;

            newBlock.time = new Date().getTime().toString().slice(0, -3);
            newBlock.previousBlockHash = lastBlock.hash;
            newBlock.height = lastBlock.height + 1;

            newBlock.hash = newBlock.myBashBuilder();

            BlockBox.addLevelDBData(newBlock.hash, newBlock);

        });

    }

}

(function start() {

    menu = ['Verify Genesis', 'Create a new Block', 'Check last block integrity', 'Check chain integrity',
        'Get block usin height', 'Validate Block'];
    index = readlineSync.keyInSelect(menu, 'Hello warrior, choose your weapon!');

    switch (index) {
        case 0:
            (function () {
                BlockBox.getFirstBlock().then((data) => {
                    console.log(data);
                    start();
                });
            })();
            break;
        case 1:
            (function () {
                var body = readlineSync.question('Write the body block...');
                let b = new Blockchain()
                b.addBlock(new Block('body => ' + body));
            })();
            break;
        case 2:
            (function () {
                BlockBox.getLastBlock().then((data) => {
                    console.log(data);
                });
            })();
            break;
        case 3:
            (function () {
                BlockBox.validateChain().then((data) => {
                    console.log(data);
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
                });
            })();
            break;
        default:
            console.log('saindo');
    }
})();
