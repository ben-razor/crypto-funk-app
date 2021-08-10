import Web3 from 'web3';
import * as CryptoFunkMarket from './CryptoFunkMarket.json';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class CryptoFunkWrapper {

    constructor(web3) {
			this.address = null;
			this.web3 = web3;
			this.contract = new web3.eth.Contract(CryptoFunkMarket.abi);
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getStoredValue(fromAddress) {
        const data = await this.contract.methods.get().call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async setStoredValue(value, fromAddress) {
        const tx = await this.contract.methods.set(value).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
            value
        });

        return tx;
    }

    async deploy(fromAddress, name, symbol, hash, img_count) {
        const deployTx = await (this.contract
					.deploy({
							data: CryptoFunkMarket.bytecode,
							arguments: [name, symbol, hash, img_count]
					})
					.send({
							...DEFAULT_SEND_OPTIONS,
							from: fromAddress,
							to: '0x0000000000000000000000000000000000000000'
					})
				);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
