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
    nodeUrl: 'http://localhost:3030',
    keyStore: new nearAPI.keyStores.InMemoryKeyStore(),
    networkId: 'local',
    evmAccountId: 'evm.test.node0',
    walletUrl: 'https://wallet.betanet.near.org',
    explorerUrl: 'https://explorer.betanet.near.org',
};

nearConfig.keyStore.setKey(
    nearConfig.networkId,
    'test.node0',
    nearAPI.KeyPair.fromString(
        'ed25519:4AP5J91naiA2f6BXQhF24ycNqeemEjVmsPm1qNs8GzL5aWCUUAGU43yTZ95uwpFc5tRTrmNLgdFxKRxw8Fpbb9ec',
    ),
);


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
