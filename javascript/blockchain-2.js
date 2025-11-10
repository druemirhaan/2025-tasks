const crypto = require("crypto");


class Block{
    constructor(index, timestamp, data, previousHash = "" ){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return crypto.createHash("sha256")
        .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
        .digest("hex");
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();

        }
        console.log(`Blok madenciliği tamamlandı: ${this.hash}`);
    }


}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
    }
    createGenesisBlock(){
        return new Block(0, Date.now(),"Genesis Block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        console.log(`Blok {newBlock.index} kazılmaya başlıyor...`);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
        
    }
    isChainValid() {
         for (let i = 1; i < this.chain.length; i++) {
            const current = this.chain[i];
            const previous = this.chain[i - 1];

            if(current.hash !== current.calculateHash()){
                 return false;
            }
            if(current.previousHash !== previous.hash) {
                return false;
                }
        }
        return true;


    }

}
let myChain = new Blockchain();

myChain.addBlock(new Block(1, Date.now(),{from: "ali", to: "veli", amount: 10}));
myChain.addBlock(new Block(2, Date.now(),{from: "ayşe", to: "ahmet", amount: 20}));
console.log("\nBlockhain.",JSON.stringify(myChain,null,2));
console.log("\nChain geçerli mi?", myChain.isChainValid());


