const AbstractCurrencyWallet = require('/src/core/blockchain/credentials/protocols/AbstractCurrencyWallet');
const {payments,networks}= require('bitcoinjs-lib');
const NETWORK = networks.testnet;
const bip39 = require("bip39");
const ecc = require('@bitcoinerlab/secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);
const isProduction = require('/src/js/isProduction');
class BtcWallet extends AbstractCurrencyWallet{

    _getDirevationPath(){
        // if(isProduction){
        //     return `m/44'/0'/0'/0/0`;
        // }else {
        //     return `m/44'/1'/0'/0/0`;
        // }
        return `m/44'/1'/0'/0/0`;
    }
    _getNetwork(){
        // if(isProduction){
        //     return networks.bitcoin;
        // }else {
        //     return networks.testnet;
        // }
        return NETWORK;
    }


    provideAddress(mnemonic) {
        return new Promise(async(resolve,reject)=>{
            try {
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bip32.fromSeed(seed, this._getNetwork());
                const child = root.derivePath(this._getDirevationPath());
                const { address } = payments.p2pkh({ pubkey: child.publicKey, network: this._getNetwork() });
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        })
    }
    providePrivateKey(mnemonic) {
        return new Promise(async(resolve,reject)=>{
            try {
                const seed = await bip39.mnemonicToSeed(mnemonic);
                const root = bip32.fromSeed(seed, this._getNetwork());
                const child = root.derivePath(this._getDirevationPath());
                const privateKey = child.toWIF();
                return resolve(privateKey);
            } catch (e) {
                return reject(e)
            }
        })
    }

}

module.exports = BtcWallet;