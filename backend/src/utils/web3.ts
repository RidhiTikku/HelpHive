import { ethers } from 'ethers';

export class Web3Service {
  private provider: ethers.Provider;
  private wallet?: ethers.Wallet;

  constructor() {
    // Initialize provider (can be configured for different networks)
    this.provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || 'http://localhost:8545'
    );
    
    if (process.env.PRIVATE_KEY) {
      this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    }
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async verifySignature(
    message: string,
    signature: string,
    expectedAddress: string
  ): Promise<boolean> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  async createEscrowTransaction(
    contractAddress: string,
    taskId: string,
    amount: string,
    helperAddress: string
  ): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not configured');
    }

    // This would interact with the escrow smart contract
    // Implementation depends on the specific contract ABI
    const tx = {
      to: contractAddress,
      value: ethers.parseEther(amount),
      data: '0x', // Contract call data would go here
    };

    const transaction = await this.wallet.sendTransaction(tx);
    return transaction.hash;
  }

  async getTransactionReceipt(txHash: string) {
    return await this.provider.getTransactionReceipt(txHash);
  }
}

export const web3Service = new Web3Service();
