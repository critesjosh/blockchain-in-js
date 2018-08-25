const SHA256 = require('crypto-js/sha256')

const MAX_SHA256 = 2 ** 256

class Block {
    constructor(timestamp, data) {
        this.index = 0
        this.previousHash = "0"
        this.timestamp = timestamp
        this.data = this.randomTransactions()
        this.nonce = 0
        this.hash = this.calculateHash()
    }

    calculateHash () {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }

    randomTransactions(){
        const max = 5
        const length = Math.floor(Math.random() * Math.floor(max))
        let array = []
        for(let i = 0; i < length; i++){
            array[i] = { "amount": Math.floor(Math.random() * Math.floor(max)) }
        }
        return array;
    }

}

class Blockchain {

    constructor() {
        this.chain = [this.newChain()]
        this.difficulty = 100
    }

    newChain() {
        return new Block(Date.now(), {})
    }

    addBlock(block) {
        if(this.isValidBlock(block)){
            this.chain.push(block)
        }
    }

    isValidBlock(block){
        const previousBlock = this.chain[this.chain.length - 1]
        return (parseInt(block.calculateHash(), 16) <= MAX_SHA256 / this.difficulty) && 
            previousBlock.index + 1 === block.index &&
            previousBlock.calculateHash() === block.previousHash
    }

    // Look for a valid solution to the block, try again on failure
    mineBlock(block) {
        var hash = block.calculateHash()

        block.previousHash = this.chain[this.chain.length-1].calculateHash()
        block.index = this.chain.length

        if(this.isValidBlock(block)){
            block.hash = block.calculateHash()
            this.addBlock(block)
        } else {
            block.nonce++
            this.mineBlock(block)
        }
    }    

    increaseDifficulty(){
        this.difficulty = this.difficulty * 10
    }

    decreaseDifficulty(){
        this.difficulty = this.difficulty / 10
    }

}

Vue.component("block", {
    props: ['block'],
    template: `<div class="block">
                <div>Block number: {{ block.index }}</div>
                <div class="prevHash">Previous hash: {{ block.previousHash }}</div>
                <div>Timestamp: {{ block.timestamp }}</div>
                <div>Data: {{ block.data }}</div>
                <div>Nonce: {{ block.nonce }}</div>
                <div class="hash">Hash: {{ block.hash }}</div>
              </div>`
})

new Vue({
    el:"#root",
    data: {
        chain: new Blockchain()  
    },
    methods: {
        mineBlock: function(){
            let block = new Block(Date.now(), "data")
            this.chain.mineBlock(block)
            console.log(this.chain)
        }
    }
})

