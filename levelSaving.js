var levelup = require('levelup');
const encode = require('encoding-down');
var leveldown = require('leveldown');

const SHA256 = require('crypto-js/sha256');
const lexint = require('lexicographic-integer-encoding')('hex');

let Block = require('./block');


const chainDB = './chaindata';
const indexDB = './indexdata';

const db = levelup(leveldown(chainDB));
const idb = levelup(encode(leveldown(indexDB), {keyEncoding: lexint}));

class SaveChain {

    static createNewBlock(body) {
        let newBlock = new Block(body);
        return new Promise((resolve) => {
            resolve(
                this.getLastBlock().then((data) => {
                    let lastBlock = data;
                    newBlock.time = new Date().getTime().toString().slice(0, -3);
                    newBlock.previousBlockHash = lastBlock.hash;
                    newBlock.height = lastBlock.height + 1;
                    newBlock.hash = newBlock.myBashBuilder();
                    this.addLevelDBData(newBlock.hash, newBlock).then((data) =>{
                        return data;
                    });
                })
            );
        });
    }

    static checkGenesis() {
        return new Promise((resolve) => {
            return this.getBlockAtPosition(0).then((data) => {
                if (data.hasOwnProperty('error')) {
                    resolve({success: false, message: 'Error checking genesis...'});
                } else {
                    resolve(data);
                }
            });
        });
    }


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

    static addLevelDBData(key, block) {
        return new Promise((resolve) => {
            return db.put(key, JSON.stringify(block), function (err) {
                if (err) return {success: false, block: block, error_bag: err};

                idb.put(block.height, block.hash), function (error) {
                    if (error) return {success: false, block: block, error_bag: error};
                };
                resolve({success: true, block: block});
            });
        });
    }


    static addGenesisBlock() {
        return new Promise((resolve) => {
            let block = new Block("First block in the chain - Genesis block");
            block.time = new Date().getTime().toString().slice(0, -3);
            block.height = 0;
            block.previousBlockHash = "0000000000000000000000000000000000000000000000000000000000000000";
            block.hash = SHA256(JSON.stringify(block)).toString();
            resolve(this.addLevelDBData(block.hash, block).then((firstBlockCreated) => {
                return firstBlockCreated;
            }));
        });
    }

    static getAllBLocks() {
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
            this.getAllBLocks().then((blocks) => {
                Promise.all(blocks).then((data) => {
                    let ar = data.sort(this.compare);
                    let result = {};
                    result.success = [];
                    result.fail = [];
                    for (let i = 0; i < ar.length - 1; i++) {

                        var newest = ar[i];
                        var oldest = ar[i + 1];

                        if (newest.previousBlockHash == oldest.hash && newest.height == oldest.height + 1) {
                            let retorno = [
                                {'newBLock': newest, 'oldBlock': oldest}
                            ];
                            result.success.push(retorno);
                        } else {
                            let retorno = [
                                {'newBLock': newest, 'oldBlock': oldest}
                            ];
                            result.fail.push(retorno);
                        }
                    }
                    resolve(result);
                });
            })
        });
    }

    static getBlockChainHeight(){
        return new Promise((resolve) => {
            this.getLastBlock().then((data) => {
                resolve(data.height);
            });
        });
    }

    static compare(a, b) {
        if (a.height > b.height)
            return -1;
        if (a.height < b.height)
            return 1;
        return 0;
    }

}

module.exports = SaveChain;