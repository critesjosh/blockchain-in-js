const SHA256 = require('crypto-js/sha256')

const BC = require("./utils/blockchain-helpers.js")
const transactions = require("./utils/transactions-list.js")

class Block {
    constructor(timestamp, data) {
        this.index = 0
        this.previousHash = "0"
        this.timestamp = timestamp
        this.data = transactions[0]
        this.nonce = 0
        this.hash = BC.calculateHashForBlock(this)
    }

    // randomTransactions(){
    //     const max = 5
    //     const length = Math.floor(Math.random() * Math.floor(max))
    //     let array = []
    //     for(let i = 0; i < length; i++){
    //         array[i] = transactions[i]
    //     }
    //     return array;
    // }

}

class Blockchain {

    constructor() {
        this.chain = [this.newChain()]
        this.difficulty = 100
    }

    newChain() {
        return new Block(Date.now(), {})
    }

    // Look for a valid solution to the block, try again on failure
    mineBlock(block) {
        block.previousHash = BC.calculateHashForBlock(BC.getLatestBlock(this.chain))
        block.hash = BC.calculateHashForBlock(block)
        block.index = this.chain.length

        if(BC.isValidBlock(block, this)){
            this.chain.push(block)
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
        }
    },
    computed: {
        reverseChain: function(){
            return this.chain.chain.slice().reverse()
        }
    }
})

