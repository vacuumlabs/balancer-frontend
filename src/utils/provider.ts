// NOT NEEDED ON NEAR
import { AlchemyProvider, InfuraProvider, Web3Provider } from '@ethersproject/providers';

// import config from '@/config';

// const provider = new InfuraProvider(config.network, config.infuraKey);

// export default provider;

// const debugProvider = new AlchemyProvider(config.network, config.alchemyKey);

// export { debugProvider };

import { NearProvider, nearAPI } from 'near-web3-provider';
import { EthersNEARWeb3 } from '../web3/near';


const nearConfig = {
    nodeUrl: 'https://rpc.betanet.near.org/',
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    networkId: 'betanet',
    evmAccountId: 'evm',
    walletUrl: 'https://wallet.betanet.near.org',
    explorerUrl: 'https://explorer.betanet.near.org',
};


const provider = new EthersNEARWeb3(new NearProvider({
    nodeUrl: nearConfig.nodeUrl,
    keyStore: nearConfig.keyStore,
    networkId: nearConfig.networkId,
    evmAccountId: nearConfig.evmAccountId,
    walletUrl: nearConfig.walletUrl,
    explorerUrl: nearConfig.explorerUrl,
    isReadOnly: true,
}));

export default provider;
