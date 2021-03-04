import { ExternalProvider, Formatter, JsonRpcFetchFunc, Networkish, Web3Provider } from '@ethersproject/providers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import LockConnector from '@snapshot-labs/lock/src/connector';
import { NearProvider, nearAPI } from 'near-web3-provider';
import { WalletConnection } from 'near-api-js';


export class NEARFormatter extends Formatter {
    hex(value: any, _?: boolean): string {
        return value;
    }
    hash(value: any, _?: boolean): string {
        return value;
    }
}

export class EthersNEARWeb3 extends Web3Provider {
    constructor(provider: ExternalProvider | JsonRpcFetchFunc, network?: Networkish) {
        super(provider, network);
        this.formatter = new NEARFormatter();
    }

    _wrapTransaction(tx: any, hash?: string): TransactionResponse {
        if (hash != null && hash.split(':')[0].length !== 44) {
            throw new Error('invalid response - sendTransaction');
        }

        const result = tx as TransactionResponse;
        // Check the hash we expect is the same as the hash the server reported
        if (hash != null && tx.hash !== hash) {
            throw new Error('Transaction hash mismatch');
        }

        // @TODO: (confirmations? number, timeout? number)
        result.wait = async (confirmations?: number): Promise<any> => {
            // We know this transaction *must* exist (whether it gets mined is
            // another story), so setting an emitted value forces us to
            // wait even if the node returns null for the receipt
            if (confirmations !== 0) {
                this._emitted['t:' + tx.hash] = 'pending';
            }

            const receipt = await this.waitForTransaction(tx.hash, confirmations);
            if (receipt == null && confirmations === 0) {
                return null;
            }

            // No longer pending, allow the polling loop to garbage collect this
            this._emitted['t:' + tx.hash] = receipt.blockNumber;

            if (receipt.status === 0) {
                throw new Error('Transaction failed');
            }
            console.log({ receipt });
            return receipt;
        };

        return result;
    }
}

var walletAccount: WalletConnection;
export class NearConnector extends LockConnector {
    async connect(): Promise<any> {
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

            walletAccount = new nearAPI.WalletAccount(near, undefined);
            let accountId = walletAccount.getAccountId();
            if (!accountId) {
                const url = process.env.DEPLOYED_URL ||'http://localhost:8080'
                await walletAccount.requestSignIn(
                    'evm',
                    'Balancer Exchange',
                    url + '/#/nearSuccess',
                    undefined,
                );
                accountId = walletAccount.getAccountId();
            }

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

    logout(): any {
        if (!walletAccount) throw new Error("Near connection not defined on logout!")
        walletAccount.signOut();
    }

    isLoggedIn() {
        if(!walletAccount) throw new Error("Near connection not defined!")
        return walletAccount.isSignedIn();
    }
}
