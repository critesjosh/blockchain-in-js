const SHA256 = require('crypto-js/sha256')

const BC = require("./utils/blockchain-helpers.js")
const transactions = require("./utils/transactions-list.js")

const MAX_SHA256 = 2 ** 256

class Block {
    constructor(timestamp, data) {
        this.index = 0
        this.previousHash = "0"
        this.timestamp = timestamp
        this.data = this.randomTransactions()
        this.nonce = 0
        this.hash = BC.calculateHashForBlock(this)
    }

    randomTransactions(){
        const max = 5
        const length = Math.floor(Math.random() * Math.floor(max))
        let array = []
        for(let i = 0; i < length; i++){
            array[i] = transactions[i]
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
        return (parseInt(BC.calculateHashForBlock(block), 16) <= MAX_SHA256 / this.difficulty) && 
            previousBlock.index + 1 === block.index &&
            BC.calculateHashForBlock(previousBlock) === block.previousHash
    }

    // Look for a valid solution to the block, try again on failure
    mineBlock(block) {
        var hash = BC.calculateHashForBlock(block)

        block.previousHash = BC.calculateHashForBlock(BC.getLatestBlock(this.chain))
        block.index = this.chain.length

        if(this.isValidBlock(block)){
            block.hash = BC.calculateHashForBlock(block)
            this.addBlock(block)
        } else {
            block.nonce++
            this.mineBlock(block)
        }
    }    

}

Vue.component("block", {
    props: ['block'],
    template: `<div class="block">
                <h3>Block number: {{ block.index }}</h3>
                <div class="hash">Hash: {{ block.hash }}</div>
                <div>Timestamp: {{ block.timestamp }}</div>
                <div>Data: {{ block.data }}</div>
                <div>Nonce: {{ block.nonce }}</div>
                <div class="prevHash">Previous hash: {{ block.previousHash }}</div>
              </div>`
}) 

new Vue({
    el:"#root",
    data() {
        return { chain: new Blockchain() }  
    },
    methods: {
        mineBlock: function(){
            let block = new Block(Date.now(), "data")
            this.chain.mineBlock(block)
            console.log(this.chain)
        }
    },
    computed: {
        reverseChain: function(){
            return this.chain.chain.slice().reverse()
        }
    }
})

