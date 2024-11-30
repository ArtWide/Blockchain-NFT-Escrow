import time
import traceback
from web3 import Web3
import os

class Event_Filter():
    def read_ABI_from_file(self, contract_name):
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            file = open(f'{current_dir}/abi/{contract_name}', 'r')
            return file.read()
        except:
            return None

    def read_last_block(self, file_path):
        try:
            with open(file_path, 'r') as file:
                return int(file.read().strip())
        except:
            return w3.eth.blockNumber

    def save_last_block(self, file_path, block_number):
        with open(file_path, 'w+') as file:
            file.write(str(block_number))

    def handle_migration(self, event):
        print("emit Migration event")
        user = event['args']['user']
        token_id = event['args']['tokenId']
        amount = event['args']['amount']
        migration_time = event['args']['timestamp']
        transaction_hash = event['transactionHash'].hex()
        print(f"user address: {user}, token ID: {token_id}, amount: {amount}, timestamp: {migration_time}, transaction hash: {transaction_hash}")

    def monitor_events(self, w3, contract_address, network, block_size, contract_abi, from_block, current_block):
        contract = w3.eth.contract(address=contract_address, abi=contract_abi)
        if from_block == 0 or from_block > current_block:
            from_block = current_block - block_size  # recent 1500 blocks

        while from_block < current_block:
            to_block = min(from_block + (block_size - 1), current_block)
            print(f'Now processing {network} blocks {from_block} to {to_block}...')

            event_filter_Migration = contract.events.Migration.createFilter(fromBlock=from_block, toBlock=to_block)

            for event in event_filter_Migration.get_all_entries():
                self.handle_migration(event)

            from_block = to_block + 1

eventFilter = Event_Filter()
RPC = {
       'Base_testnet': 'https://84532.rpc.thirdweb.com/'
        # add more RPC URLs
        # 'Polygon_mainnet': 'https://polygon-mainnet.g.alchemy.com/v2/THISISKEY',
        # 'Avalanche_mainnet': 'https://avax-mainnet.g.alchemy.com/v2/THISISKEY',
        # 'opBNB_mainnet': 'https://bsc-dataseed.binance.org/',
       }

# NETWORK = ['Polygon', 'Base', 'Avalanche', 'opBNB']
NETWORK = ['Base']
# NETTYPE = 'mainnet'
NETTYPE = 'testnet'
BLOCK_SIZE = 1500
CONTRACT_ADDRESS = '0x1dF4DB808FD43A867A087D38c01e804E3b3e6f81'

EVENT_FILTER_INTERVAL = 60
while True:
    for NET in NETWORK:
        try:
            BLOCK_FILE = f'./block/{NET}_{NETTYPE}.txt'
            ABI_FILE = 'NFT_Migration'
            abi = eventFilter.read_ABI_from_file(ABI_FILE)

            # Web3 인스턴스 생성 및 Ethereum 노드에 연결
            rpc_url = RPC[f'{NET}_{NETTYPE}']
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            # fromBlock 읽기
            from_block = eventFilter.read_last_block(BLOCK_FILE)
            # 최신 블록 번호 가져오기
            current_block = w3.eth.blockNumber
            # 이벤트 모니터링
            eventFilter.monitor_events(w3, CONTRACT_ADDRESS, NET, BLOCK_SIZE, abi, from_block, current_block)
            # 마지막 조회한 블록 번호 저장
            eventFilter.save_last_block(BLOCK_FILE, current_block)
        except:
            traceback.print_exc()
            print(f'Failed to get data from {NET} {NETTYPE}.')

    time.sleep(EVENT_FILTER_INTERVAL)