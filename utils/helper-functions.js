const SHA256 = require('crypto-js/sha256')

module.exports = {
    calculateHashForBlock (block) {
        return calculateHash(block.index, block.previousHash, block.timestamp, block.data);
    },

}