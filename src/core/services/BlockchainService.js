const EthLib = require("../blockchain/eth/EthLib");
const Erc20Lib = require("../blockchain/erc20/Erc20Lib");
const BtcLib = require("../blockchain/btc/BtcLib");
const LtcLib = require("../blockchain/ltc/LtcLib");
const BnbLib = require("../blockchain/bnb/BnbLib");

const CredentialService = require('../blockchain/credentials/CredentialService');

class BlockchainService{
    constructor(app) {
        this.app = app;
        this.credentials = new CredentialService(app);
        let eth = new EthLib(app);
        let erc20 = new Erc20Lib(app);
        let btc = new BtcLib(app);
        let ltc = new LtcLib(app);
        let bnb = new BnbLib(app);

        this.libraries={
            "ETH":eth,
            "ERC20":erc20,
            "BTC":btc,
            "LTC":ltc,
            "BNB":bnb
        };
    }

    getCurrentLibrary(){
        return this.libraries[this.app.getCurrency()];
    }

    getCurrentBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let balanceNative = await this.getCurrentLibrary().getCurrentBalance();
                return resolve(balanceNative);
            } catch (e){
                return reject(e);
            }
        })
    }

    getAddress(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.getCurrentLibrary().getAddress();
                return resolve(address);
            } catch (e){
                return reject(e);
            }
        })
    }

    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let usdBalance = await this.getCurrentLibrary().getUsdBalance();
                return resolve(usdBalance);
            } catch (e){
                return reject(e);
            }
        })
    }

    getNonce(){
        return new Promise(async(resolve, reject)=>{
            try{
                let nonce = await this.getCurrentLibrary().getNextNonce();
                return resolve(nonce);
            } catch (e){
                return reject(e);
            }
        })
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                let resultSendCurrency = await this.getCurrentLibrary().sendCurrency(to, amount);
                return resolve(resultSendCurrency);
            } catch (e){
                return reject(e);
            }
        })
    }

    generateMnemonic(){
        return new Promise(async(resolve,reject)=>{
            try{
                let result =await this.credentials.generateMnemonic();
                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }

    importMnemonic(mnemonic){
        return new Promise(async(resolve,reject)=>{
            try{
                let result =await this.credentials.importMnemonic(mnemonic);

                // TODO Update credentials
                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }


}

module.exports = BlockchainService;