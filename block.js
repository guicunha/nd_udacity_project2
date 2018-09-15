/** block.js **/
const SHA256 = require('crypto-js/sha256');


class Block {

    constructor(data) {
        this.hash = "";
        this.height = 0;
        this.body = data;
        this.time = this.blockTime();
        this.previousBlockHash = "";

    }

    blockTime(){
        return new Date().getTime().toString().slice(0, -3);
    }

    getHeight(){
        return this.height;
    }

    validateBlock(previousBlock){
        let previous = previousBlock;

        if(this.previousBlockHash == previous.hash && this.height == previous.height){
            return true;
        } else {
            return false;
        }
    }

    myBashBuilder(){
        let block = this;
        block.hash = '';
        return SHA256(JSON.stringify(block)).toString();
    }

}


module.exports = Block;