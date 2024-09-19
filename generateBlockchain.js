class Block {
  constructor(index, previousHash = null, transactions = "") {
    this.index = index;
    this.transactions = transactions ?? ""; // Default to empty string if null/undefined
    this.previousHash = previousHash ?? "0".repeat(64); // Default to all 0's hash if null/undefined
    this.nonce = 0;
    this.hash = "";
  }

  async calculateHash() {
    const data = this.transactions + this.index + this.nonce + this.previousHash;
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = await this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor(difficulty = 3) {
    this.chain = [];
    this.difficulty = difficulty;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(transactions = "") {
    const newBlock = new Block(this.chain.length + 1, this.getLatestBlock()?.hash, transactions);
    await newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
}

// Example usage:
(async function () {
  const blockchain = new Blockchain();

  await blockchain.addBlock("Block 1");

  await blockchain.addBlock("Block 2");

  console.log(JSON.stringify(blockchain, null, 4));
})();
