const MnemonicGenerator = require("/src/core/blockchain/credentials/MnemonicGenerator");
const EthWallet = require('../credentials/protocols/EthWallet');
const Erc20Wallet = require('../credentials/protocols/Erc20Wallet');
const BtcWallet = require('../credentials/protocols/BtcWallet');
const LtcWallet = require('../credentials/protocols/LtcWallet');
const BnbWallet = require('../credentials/protocols/BnbWallet');
const BTC = "BTC";
const LTC = "LTC";
const ETH = "ETH";
const ERC20 = "ERC20";
const BNB = "BNB";

const Validator = require("/src/core/validators/Validator");
class CredentialService {
    constructor(app) {
        this.app = app;
        this.validator = new Validator();
        this.generator = new MnemonicGenerator();
        let eth = new EthWallet();
        let erc20 = new Erc20Wallet();
        let btc = new BtcWallet();
        let ltc = new LtcWallet();
        let bnb = new BnbWallet();
        this.mnemonic = "";
        this.protocols = {
            BTC:btc,
            ETH:eth,
            ERC20:erc20,
            LTC: ltc,
            BNB: bnb
        }
    }
    _getActiveProtocol(){
        return this.protocols[this.app.getCurrency()];
    }
    generateMnemonic(){
        return this.generator.generateMnemonic();
    }

    _setMnemonic(mnemonic){
        localStorage.clear();
        this.validator.validateString(mnemonic);
        this.mnemonic = mnemonic;
        localStorage.setItem('mnemonic', mnemonic);
    }
    _getMnemonic(){
        return localStorage.getItem('mnemonic');
        // return this.mnemonic;
    }

    importMnemonic(mnemonic){
        this._setMnemonic(mnemonic);
    }


    getAddress(){
        return new Promise(async(resolve,reject)=>{
            try {
                return resolve(
                    this._getActiveProtocol().provideAddress(
                        this._getMnemonic()));
            } catch (e) {
                return reject(e);
            }
        })
    }


    getPrivateKey(){
        return new Promise(async(resolve,reject)=>{
            try {
                return resolve(this._getActiveProtocol().providePrivateKey(this._getMnemonic()));
            } catch (e) {
                return reject(e);
            }
        })
    }

}

module.exports = CredentialService;