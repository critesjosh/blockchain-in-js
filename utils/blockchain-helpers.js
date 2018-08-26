const SHA256 = require('crypto-js/sha256')

const MAX_SHA256 = 2 ** 256

module.exports = {

    calculateHashForBlock (block) {
        return SHA256(block.index + block.previousHash + block.timestamp + block.data + block.nonce).toString()
    },

    getLatestBlock (blockchain) {
        return blockchain[blockchain.length - 1]
    }, 

    isValidNewBlock (newBlock, previousBlock) {
        if (previousBlock.index + 1 !== newBlock.index) {
            console.log('invalid index');
            return false;
        } 
        return true;
    },

    isValidBlock(block, blockchain){
        const previousBlock = this.getLatestBlock(blockchain.chain)

        // check that the block hash is below the target difficulty
        // check that the block index is incremented by 1
        // check that the block hashes match

        return (parseInt(this.calculateHashForBlock(block), 16) <= MAX_SHA256 / blockchain.difficulty) && 
            previousBlock.index + 1 === block.index &&
            this.calculateHashForBlock(previousBlock) === block.previousHash
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