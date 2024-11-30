const fs = require('fs').promises;
const path = require('path');
const Web3 = require('web3');

class EventFilter {
    async readABIFromFile(contractName) {
        try {
            const currentDir = path.dirname(require.main.filename);
            const content = await fs.readFile(`${currentDir}/abi/${contractName}`, 'utf8');
            return content;
        } catch (error) {
            console.error('Error reading ABI file:', error);
            return null;
        }
    }

    async readLastBlock(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return parseInt(content.trim());
        } catch (error) {
            console.error('Error reading last block:', error);
            return null;
        }
    }

    async saveLastBlock(filePath, blockNumber) {
        try {
            await fs.writeFile(filePath, blockNumber.toString());
        } catch (error) {
            console.error('Error saving last block:', error);
        }
    }

    handleMigration(event) {
        console.log("emit Migration event");
        const user = event.returnValues.user;
        const tokenId = event.returnValues.tokenId;
        const amount = event.returnValues.amount;
        const migrationTime = event.returnValues.timestamp;
        const transactionHash = event.transactionHash;
        console.log(`user address: ${user}, token ID: ${tokenId}, amount: ${amount}, timestamp: ${migrationTime}, transaction hash: ${transactionHash}`);
    }

    async monitorEvents(w3, contractAddress, network, blockSize, contractAbi, fromBlock, currentBlock) {
        const contract = new w3.eth.Contract(JSON.parse(contractAbi), contractAddress);

        if (fromBlock === 0 || fromBlock > currentBlock) {
            fromBlock = currentBlock - blockSize; // recent 1500 blocks
        }

        while (fromBlock < currentBlock) {
            const toBlock = Math.min(fromBlock + (blockSize - 1), currentBlock);
            console.log(`Now processing ${network} blocks ${fromBlock} to ${toBlock}...`);

            try {
                const events = await contract.getPastEvents('Migration', {
                    fromBlock: fromBlock,
                    toBlock: toBlock
                });

                for (const event of events) {
                    this.handleMigration(event);
                }
            } catch (error) {
                console.error(`Error getting events for blocks ${fromBlock} to ${toBlock}:`, error);
            }

            fromBlock = toBlock + 1;
        }
    }
}

const RPC = {
    'Base_testnet': 'https://84532.rpc.thirdweb.com/'
    // add more RPC URLs as needed
    // 'Polygon_mainnet': 'https://polygon-mainnet.g.alchemy.com/v2/THISISKEY',
    // 'Avalanche_mainnet': 'https://avax-mainnet.g.alchemy.com/v2/THISISKEY',
    // 'opBNB_mainnet': 'https://bsc-dataseed.binance.org/',
};

const NETWORK = ['Base'];
const NETTYPE = 'testnet';
const BLOCK_SIZE = 1500;
const CONTRACT_ADDRESS = '0x1dF4DB808FD43A867A087D38c01e804E3b3e6f81';
const EVENT_FILTER_INTERVAL = 60000; // milliseconds

async function main() {
    const eventFilter = new EventFilter();

    while (true) {
        for (const NET of NETWORK) {
            try {
                const BLOCK_FILE = path.join('./block', `${NET}_${NETTYPE}.txt`);
                const ABI_FILE = 'NFT_Migration';
                const abi = await eventFilter.readABIFromFile(ABI_FILE);

                if (!abi) {
                    console.error(`Failed to read ABI for ${NET}`);
                    continue;
                }

                const rpcUrl = RPC[`${NET}_${NETTYPE}`];
                const w3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

                let fromBlock = await eventFilter.readLastBlock(BLOCK_FILE);

                const currentBlock = await w3.eth.getBlockNumber();

                await eventFilter.monitorEvents(
                    w3,
                    CONTRACT_ADDRESS,
                    NET,
                    BLOCK_SIZE,
                    abi,
                    fromBlock,
                    currentBlock
                );

                await eventFilter.saveLastBlock(BLOCK_FILE, currentBlock);
            } catch (error) {
                console.error(`Failed to get data from ${NET} ${NETTYPE}:`, error);
            }
        }

        await new Promise(resolve => setTimeout(resolve, EVENT_FILTER_INTERVAL));
    }
}

main().catch(console.error);