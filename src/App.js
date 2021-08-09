import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { CONFIG } from './config.js';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const providerConfig = {
    rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
    ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
    web3Url: godwokenRpcUrl
};

const DEFAULT_SEND_OPTIONS = {
  gas: 6000000
};

function App() {
  const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
  const web3 = new Web3(provider);

  function doSomething() {
    contract.methods.set(value).send({
      ...DEFAULT_SEND_OPTIONS,
      from: fromAddress
    });
  }

  async function deploy() {
    const contract = await (contract
      .deploy({
          data: SimpleStorageJSON.bytecode,
          arguments: []
      })
      .send({
          ...DEFAULT_SEND_OPTIONS,
          from: fromAddress,
          to: '0x0000000000000000000000000000000000000000'
      }));

      useDeployed(contract.contractAddress);
  }

  function getPolyjuiceAddress(ethereumAddress) {
    const addressTranslator = new AddressTranslator();
    const polyjuiceAddress = addressTranslator.ethAddressToGodwokenShortAddress(ethereumAddress);
    return polyjuiceAddress;
  }

  return (
    <div className="App">
        <p>
          Web Provider URL: {CONFIG['WEB3_PROVIDER_URL']}
        </p>
        <p>
          ROLLUP_TYPE_HASH: {CONFIG['ROLLUP_TYPE_HASH']}
        </p>
        <p>
          ETH_ACCOUNT_LOCK_CODE_HASH: {CONFIG['ETH_ACCOUNT_LOCK_CODE_HASH']}
        </p>
    </div>
  );
}

export default App;
