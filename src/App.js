import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';
import { CryptoFunkWrapper } from './lib/contracts/CryptoFunkWrapper';
import { CONFIG } from './config.js';
import BigInt from 'big-integer';

const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
const providerConfig = {
    rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
    ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
    web3Url: godwokenRpcUrl
};

const DEFAULT_SEND_OPTIONS = {
  gas: 6000000
};

async function createWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
        const providerConfig = {
            rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
            ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
            web3Url: godwokenRpcUrl
        };

        const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
        const web3 = new Web3(provider || Web3.givenProvider);

        try {
            // Request account access if needed
            await (window).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState();
  const [accounts, setAccounts] = useState([]);
  const [l2Balance, setL2Balance] = useState();
  const [existingContractIdInputValue, setExistingContractIdInputValue] = useState('');
  const [storedValue, setStoredValue] = useState();
  const [deployTxHash, setDeployTxHash] = useState();
  const [polyjuiceAddress, setPolyjuiceAddress] = useState();
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const toastId = React.useRef(null);
  const [newStoredNumberInputValue, setNewStoredNumberInputValue] = useState();

  useEffect(() => {
      if (accounts[0]) {
          const addressTranslator = new AddressTranslator();
          setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts[0]));
      } else {
          setPolyjuiceAddress(undefined);
      }
  }, [accounts[0]]);

  useEffect(() => {
      if (transactionInProgress && !toastId.current) {
          toastId.current = toast.info(
              'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
              {
                  position: 'top-right',
                  autoClose: false,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  closeButton: false
              }
          );
      } else if (!transactionInProgress && toastId.current) {
          toast.dismiss(toastId.current);
          toastId.current = null;
      }
  }, [transactionInProgress, toastId.current]);

  const account = accounts[0];

  async function deployContract() {
      const _contract = new CryptoFunkWrapper(web3);

      try {
          setDeployTxHash(undefined);
          setTransactionInProgress(true);

          const transactionHash = await _contract.deploy(account,
            "CRYPTOFUNK",
            "☮",
            "f50027cdefc8f564d4c1fac14b5a656c5e452476e490acac827dd00e5d9b0f8e",
            4
          );

          setDeployTxHash(transactionHash);
          setExistingContractAddress(_contract.address);
          toast(
              'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
              { type: 'success' }
          );
      } catch (error) {
          console.error(error);
          toast.error(
              'There was an error sending your transaction. Please check developer console.'
          );
      } finally {
          setTransactionInProgress(false);
      }
  }

  async function getStoredValue() {
      let value = await contract.punkIndexToAddress();
      toast('Successfully read latest stored value.', { type: 'success' });

      setStoredValue(value);
  }

  async function setExistingContractAddress(contractAddress) {
      const _contract = new CryptoFunkWrapper(web3);
      _contract.useDeployed(contractAddress.trim());

      setContract(_contract);
      setStoredValue(undefined);
  }

  async function setNewStoredValue() {
      try {
          setTransactionInProgress(true);
          await contract.setStoredValue(newStoredNumberInputValue, account);
          toast(
              'Successfully set latest stored value. You can refresh the read value now manually.',
              { type: 'success' }
          );
      } catch (error) {
          console.error(error);
          toast.error(
              'There was an error sending your transaction. Please check developer console.'
          );
      } finally {
          setTransactionInProgress(false);
      }
  }

  useEffect(() => {
      if (web3) {
          return;
      }

      (async () => {
          const _web3 = await createWeb3();
          setWeb3(_web3);

          const _accounts = [window.ethereum.selectedAddress];
          setAccounts(_accounts);

          if (_accounts && _accounts[0]) {
                let res = await _web3.eth.getBalance(_accounts[0]);
              const _l2Balance = BigInt(res).value;
              setL2Balance(_l2Balance);
          }
      })();
  });

  const LoadingIndicator = () => <span className="rotating-icon">⚙️</span>;

  return (

      <div>
        <div class="center-panel">
            <h1>Crypto Funk</h1>
            <p>Really exclusive, high quality NFT artworks</p>
            <div class="image-panel">
                <div class="nft-details">
                    <div class="image-nft image-0"></div>
                    <div>Sharon</div>
                    <div class="nft-controls">
                        <button>Get</button>
                    </div>
                </div>
                <div class="nft-details">
                    <div class="image-nft image-1"></div>
                    <div>Baloon Face</div>
                    <div class="nft-controls">
                        <button>Get</button>
                    </div>
                </div>
                <div class="nft-details">
                    <div class="image-nft image-2"></div>
                    <div>Don Snow</div>
                    <div class="nft-controls">
                        <button>Get</button>
                    </div>
                </div>
                <div class="nft-details">
                    <div class="image-nft image-3"></div>
                    <div>C Westwood</div>
                    <div class="nft-controls">
                        <button>Get</button>
                    </div>
                </div>
            </div>
        </div>

          Your ETH address: <b>{accounts?.[0]}</b>
          <br />
          <br />
          Your Polyjuice address: <b>{polyjuiceAddress || ' - '}</b>
          <br />
          <br />
          Nervos Layer 2 balance:{' '}
          <b>{l2Balance ? (l2Balance / 10n ** 8n).toString() : <LoadingIndicator />} CKB</b>
          <br />
          <br />
          Deployed contract address: <b>{contract?.address || '-'}</b> <br />
          Deploy transaction hash: <b>{deployTxHash || '-'}</b>
          <br />
          <hr />
          <p>
              The button below will deploy a CryptoFunk smart contract where you can buy and  
              trade crypto funks.
            </p>
          <button onClick={deployContract} disabled={!l2Balance}>
              Deploy contract
          </button>
          &nbsp;or&nbsp;
          <input
              placeholder="Existing contract id"
              onChange={e => setExistingContractIdInputValue(e.target.value)}
          />
          <button
              disabled={!existingContractIdInputValue || !l2Balance}
              onClick={() => setExistingContractAddress(existingContractIdInputValue)}
          >
              Use existing contract
          </button>
          <br />
          <br />
          <button onClick={getStoredValue} disabled={!contract}>
              Get stored value
          </button>
          {storedValue ? <>&nbsp;&nbsp;Stored value: {storedValue.toString()}</> : null}
          <br />
          <br />
          <input
              type="number"
              onChange={e => setNewStoredNumberInputValue(parseInt(e.target.value, 10))}
          />
          <button onClick={setNewStoredValue} disabled={!contract}>
              Set new stored value
          </button>
          <br />
          <br />
          <br />
          <br />
          <hr />
          The contract is deployed on Nervos Layer 2 - Godwoken + Polyjuice. After each
          transaction you might need to wait up to 120 seconds for the status to be reflected.
          <ToastContainer />
      </div>
  );

}

export default App;
