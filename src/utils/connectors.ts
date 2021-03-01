import { Lock } from '@snapshot-labs/lock/src';
import LockConnector from '@snapshot-labs/lock/src/connector';
import injected from '@snapshot-labs/lock/connectors/injected';
import fortmatic from '@snapshot-labs/lock/connectors/fortmatic';
import portis from '@snapshot-labs/lock/connectors/portis';
import walletconnect from '@snapshot-labs/lock/connectors/walletconnect';
import walletlink from '@snapshot-labs/lock/connectors/walletlink';

import defaultLogo from '@/assets/connector/default.svg';
import fortmaticLogo from '@/assets/connector/fortmatic.svg';
import frameLogo from '@/assets/connector/frame.svg';
import imtokenLogo from '@/assets/connector/imtoken.svg';
import metamaskLogo from '@/assets/connector/metamask.svg';
import portisLogo from '@/assets/connector/portis.svg';
import statusLogo from '@/assets/connector/status.svg';
import trustwalletLogo from '@/assets/connector/trustwallet.svg';
import walletconnectLogo from '@/assets/connector/walletconnect.svg';
import walletlinkLogo from '@/assets/connector/walletlink.svg';

import Web3 from 'web3';
import { NearProvider, nearWeb3Extensions, nearAPI } from 'near-web3-provider';
import * as nearlib from 'nearlib';
import web3Utils from 'web3-utils';

class NearConnector extends LockConnector {
    async connect() {
        let provider;
        try {
            const nearConfig = {
                nodeUrl: 'https://rpc.betanet.near.org/',
                keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
                networkId: 'betanet',
                evmAccountId: 'evm',
                walletUrl: 'https://wallet.betanet.near.org',
                explorerUrl: 'https://explorer.betanet.near.org',
            };

            const near = await nearAPI.connect(nearConfig);

            const walletAccount = new nearAPI.WalletAccount(near, undefined);
            await walletAccount.requestSignIn(
                'evm',
                'Balancer Exchange',
                undefined,
                undefined,
            );
            const accountId = walletAccount.getAccountId();

            provider = new NearProvider({
                nodeUrl: nearConfig.nodeUrl,
                keyStore: nearConfig.keyStore,
                masterAccountId: accountId,
                networkId: nearConfig.networkId,
                evmAccountId: nearConfig.evmAccountId,
                walletUrl: nearConfig.walletUrl,
                explorerUrl: nearConfig.explorerUrl,
                isReadOnly: false,
            });
        } catch (e) {
            console.error(e);
            return;
        }
        return provider;
    }

    logout() {
        return;
    }
}

import config from '@/config';
import { Web3Provider } from '@ethersproject/providers';

const lock = new Lock();

const connectors = { injected, fortmatic, portis, walletconnect, walletlink, NearConnector };

for (const connectorId in connectors) {
    const connector = {
        key: connectorId,
        connector: connectors[connectorId],
        options: config.connectors[connectorId],
    };
    lock.addConnector(connector);
}

export function hasInjectedProvider(): boolean {
    return !!window.ethereum;
}

export function getConnectorName(connectorId: string): string {
    console.log(JSON.stringify(connectors));
    if (connectorId === 'injected') {
        const provider = window.ethereum;
        if (provider.isMetaMask) {
            return 'MetaMask';
        }
        if (provider.isImToken) {
            return 'imToken';
        }
        if (provider.isStatus) {
            return 'Status';
        }
        if (provider.isTrust) {
            return 'Trust Wallet';
        }
        if (provider.isFrame) {
            return 'Frame';
        }
        return 'Browser Wallet';
    }
    if (connectorId === 'fortmatic') {
        return 'Fortmatic';
    }
    if (connectorId === 'portis') {
        return 'Portis';
    }
    if (connectorId === 'walletconnect') {
        return 'WalletConnect';
    }
    if (connectorId === 'walletlink') {
        return 'Coinbase Wallet';
    }
    return 'Unknown';
}

export function getConnectorLogo(connectorId: string): string {
    if (connectorId === 'injected') {
        const provider = window.ethereum;
        if (provider.isMetaMask) {
            return metamaskLogo;
        }
        if (provider.isImToken) {
            return imtokenLogo;
        }
        if (provider.isStatus) {
            return statusLogo;
        }
        if (provider.isTrust) {
            return trustwalletLogo;
        }
        if (provider.isFrame) {
            return frameLogo;
        }
        return defaultLogo;
    }
    if (connectorId === 'fortmatic') {
        return fortmaticLogo;
    }
    if (connectorId === 'portis') {
        return portisLogo;
    }
    if (connectorId === 'walletconnect') {
        return walletconnectLogo;
    }
    if (connectorId === 'walletlink') {
        return walletlinkLogo;
    }
    return defaultLogo;
}

export default lock;
