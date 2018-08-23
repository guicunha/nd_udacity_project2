var levelup = require('levelup');
const encode = require('encoding-down');
var leveldown = require('leveldown');

const SHA256 = require('crypto-js/sha256');
const lexint = require('lexicographic-integer-encoding')('hex');


const chainDB = './chaindata';
const indexDB = './indexdata';

const db = levelup(leveldown(chainDB));
const idb = levelup(encode(leveldown(indexDB), {keyEncoding: lexint}));

class SaveChain {

    /** TO-DO */
    static createNewBlock(){}

    /** TO-DO */
    static checkGenesis(){}



    static getBlock(key) {
        return new Promise((resolve) => {
            return db.get(key, (err, value) => {
                if (err) return {error: true}
                resolve(value);
            });
        });
    }

    static getLastBlock() {
        let blockHash = {};
        return new Promise((resolve) => {
            idb.createValueStream({'limit': -1, 'reverse': false}).on('data', (blocks) => {
                blockHash = blocks;
            }).on('error', (err) => {
                return console.log('Unable to read data stream!', err)
            }).on('close', () => {
                this.getBlock(blockHash).then((block) => {
                    resolve(JSON.parse(block.toString()));
                });
            });
        })
    }

    static getBlockAtPosition(key) {
        return new Promise((resolve) => {
            idb.get(key, (err, value) => {
                if (err) return resolve({error: true, message: 'Block does not found'});
                this.getBlock(value).then((block) => {
                    resolve(JSON.parse(block.toString()));
                });
            });
        });
    }

    static getFirstBlock() {
        return this.getBlockAtPosition(0).then((data) => {
            if (data.hasOwnProperty('error')) {
                return this.addGenesisBlock();
            } else {
                return data;
            }
        });
    }


    static addLevelDBData(key, block) {
        db.put(key, JSON.stringify(block), function (err) {
            if (err) return console.log('Block ' + key + ' submission failed', err);
            idb.put(block.height, block.hash), function (error) {
                if (err) return console.log('index creator ' + block.height + ' submission failed', err);
            }
        })
    }


    static addGenesisBlock() {

        let block = new Block("First block in the chain - Genesis block");
        block.time = new Date().getTime().toString().slice(0, -3);
        block.height = 0;
        block.previousBlockHash = "0000000000000000000000000000000000000000000000000000000000000000";
        block.hash = SHA256(JSON.stringify(block)).toString();

        this.addLevelDBData(block.hash, block);

    }

    static getAllBLocks(){
        let blocks = [];
        return new Promise((resolve) => {
            db.createValueStream({'reverse': false}).on('data', (block) => {
                blocks.push(JSON.parse(block));
            }).on('error', (err) => {
                return console.log('Unable to read data stream!', err)
            }).on('close', () => {
                resolve(blocks);
            });
        })
    }

    /** TO-DO **/
    // validate block
    static validateBlock(blockHeight) {

        return new Promise((resolve) => {
            this.getBlockAtPosition(blockHeight).then((block) => {

                let blockHash = block.hash;
                let blockHealth = {};

                block.hash = '';

                let validBlockHash = SHA256(JSON.stringify(block)).toString();

                if (blockHash === validBlockHash) {

                    blockHealth.integrity = true;
                    blockHealth.hash = blockHash;
                    blockHealth.height = block.height;

                    resolve(blockHealth);

                } else {
                    console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);

                    blockHealth.integrity = false;
                    blockHealth.hash = blockHash;
                    blockHealth.height = block.height;

                    resolve(blockHealth);
                }

            });
        });

    }


    static validateChain() {

        return new Promise((resolve) => {
            this.getAllBLocks().then((blocks) =>{
                Promise.all(blocks).then((data) => {
                    let ar = data.sort(this.compare);
                    let result = {};
                    result.success = [];
                    result.fail = [];
                    for(let i = 0; i < ar.length -1; i++){


                        var newest = ar[i];

                        var oldest = ar[i+1];


                        if (newest.previousBlockHash == oldest.hash && newest.height == oldest.height +1){
                            var retorno = {
                                'newBLock': newest,
                                'oldBlock': oldest,
                                'successo': true
                            }
                            result.success.push(retorno);
                        } else {
                            var retorno = {
                                'newBLock':newest,
                                'oldBlock': oldest,
                                'successo': false
                            }
                            result.fail.push(retorno);
                        }
                    }
                    resolve(result);
                });
            })
        });

    }

    static compare(a,b) {
        if (a.height > b.height)
            return -1;
        if (a.height < b.height)
            return 1;
        return 0;
    }

    static checkTwoBlocks(blockA, blockB){
        console.log(blockA);
        console.log(blockB);
    }




    static print(object) {
        return console.log(JSON.stringify(object, null, 2));
    }

}

class Block {

    constructor(data) {
        this.hash = "",
            this.height = 0,
            this.body = data,
            this.time = 0,
            this.previousBlockHash = ""
    }

}

module.exports = SaveChain;