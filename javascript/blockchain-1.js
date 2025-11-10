const crypto = require("crypto");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash("sha256")
      .update(this.index.toString() + this.timestamp.toString() + this.previousHash.toString() + JSON.stringify(this.data))
      .digest("hex");
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
    console.log(`Blok ${newBlock.index} eklendi!`);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let myChain = new Blockchain();
myChain.addBlock(new Block(1, Date.now(), { amount: 10, from: "Ali", to: "Veli" }));
myChain.addBlock(new Block(2, Date.now(), { amount: 20, from: "Ayşe", to: "Mehmet" }));

console.log("\nBlockchain:", JSON.stringify(myChain, null, 2));
console.log("\nChain geçerli mi?", myChain.isChainValid());
