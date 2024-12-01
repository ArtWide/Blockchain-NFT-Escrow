# Blockchain NFT Escrow

## Overview

This repository contains a Blockchain-based NFT Escrow solution. It enables secure migration of ERC-1155 tokens while monitoring and handling events on the blockchain. The system is designed for flexibility and scalability using Node.js and Python scripts alongside smart contracts.

---

## Features

- **Smart Contract**: The `EditionMigration` contract provides a mechanism to migrate ERC-1155 tokens securely.
- **Event Monitoring**: Scripts for both Node.js and Python monitor blockchain events for migrations.
- **Pause/Resume Migration**: Admins can pause and resume migrations as needed.
- **User Tracking**: Keeps track of migrated users and token migration counts.

---

## File Structure

### Contract
- **`NFT_Migration.sol`**: Solidity smart contract to handle ERC-1155 token migration.

### Node.js Monitoring
- **`Monitor-nodejs/event-monitor.js`**: Node.js script for monitoring migration events and processing blockchain logs.

### Python Monitoring
- **`Monitor-python/event-monitor.py`**: Python script for similar monitoring tasks as the Node.js implementation.

### Others
- **`LICENSE`**: MIT License details for the repository.

---

## Smart Contract

The `EditionMigration` contract:
- **Migrates ERC-1155 Tokens**: Users can transfer their ERC-1155 tokens to the escrow.
- **Admin Controls**:
  - Pause/Resume migration.
  - Set the ERC-1155 token contract address.
- **Tracking**:
  - Maintains a log of all migrated users.
  - Tracks token migration counts per user and token ID.

#### Events

- `Migration`: Logs the migration of tokens by users.
- `MigrationPaused`: Indicates migration was paused.
- `MigrationResumed`: Indicates migration was resumed.

---

## How to Run

### Node.js Event Monitoring

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the script:
   ```bash
   node Monitor-nodejs/event-monitor.js
   ```

### Python Event Monitoring

1. Install dependencies:
   ```bash
   pip install web3
   ```
2. Run the script:
   ```bash
   python Monitor-python/event-monitor.py
   ```

---

## Requirements

- **Solidity Compiler**: For the smart contract.
- **Node.js and Python**: To run the monitoring scripts.
- **Web3 Library**: For interacting with Ethereum-based blockchains.

---

## Testing Contracts

You can use the following contracts deployed on the Base Sepolia Testnet for testing purposes:

### ERC-1155 NFT Contract
This contract provides an example of ERC-1155 NFTs that can be migrated using the `EditionMigration` contract.

- **Contract Address**: [0xe97a6686cf19dffBC96Ce54f6C6FC8687c1b3608](https://thirdweb.com/base-sepolia-testnet/0xe97a6686cf19dffBC96Ce54f6C6FC8687c1b3608/nfts)

### Migration Contract
This contract enables the migration of ERC-1155 tokens. Use this to simulate migrations for the testing process.

- **Contract Address**: [0x1dF4DB808FD43A867A087D38c01e804E3b3e6f81](https://thirdweb.com/base-sepolia-testnet/0x1dF4DB808FD43A867A087D38c01e804E3b3e6f81/explorer)

### How to Test

1. Navigate to the links provided above to interact with the contracts on the Base Sepolia Testnet.
2. Use your wallet to interact with the contracts:
   - Mint NFTs using the ERC-1155 NFT contract.
   - Migrate the NFTs to the Migration Contract.
3. Monitor the events using the provided Node.js or Python scripts.

---
