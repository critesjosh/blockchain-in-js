const SHA256 = require('crypto-js/sha256')

module.exports = {

    calculateHashForBlock (block) {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString()
    },

    getLatestBlock (blockchain) {
        return blockchain[blockchain.length - 1]
    }, 

    addBlock (blockchain, newBlock) {
        if (isValidNewBlock(newBlock, getLatestBlock())) {
            blockchain.push(newBlock);
        }
    },

    isValidNewBlock (newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index');
            return false;
        } else if (previousBlock.hash !== newBlock.previousHash) {
            console.log('invalid previoushash');
            return false;
        } else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
            console.log(typeof (newBlock.hash) + ' ' + typeof calculateHashForBlock(newBlock));
            console.log('invalid hash: ' + calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
            return false;
        }
        return true;
    },

    replaceChain (newBlocks) {
        if (isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
            console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
            blockchain = newBlocks;
            broadcast(responseLatestMsg());
        } else {
            console.log('Received blockchain invalid');
        }
    },

    isValidChain (blockchainToValidate) {
        if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(getGenesisBlock())) {
            return false;
        }
        var tempBlocks = [blockchainToValidate[0]];
        for (var i = 1; i < blockchainToValidate.length; i++) {
            if (isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
                tempBlocks.push(blockchainToValidate[i]);
            } else {
                return false;
            }
        }
        return true;
    }

}