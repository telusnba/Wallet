// const {resolve} = require("@babel/core/lib/vendor/import-meta-resolve");
const WalletUI = require('../core/ui/WalletUI');
const BlockchainService = require('../core/services/BlockchainService');
const HttpService = require('../core/services/HttpService');
const isProduction = require('./isProduction');

const CURRENCY = "ETH";


class Application {

    constructor() {
        this.setCurrency(CURRENCY);
        this.httpService = new HttpService(this);
        this.walletUI = new WalletUI(this);
        this.blockchain = new BlockchainService(this);
    }

    changeCurrency(currency) {
        let mnemonic = app.blockchain.credentials._getMnemonic();
        if (mnemonic === null || mnemonic === undefined || mnemonic === "") {
            alert("Import or generate mnemonic");
        } else {
            this.setCurrency(currency);
            this.prepareInterface();
        }
        // this.setCurrency(currency);
        // this.prepareInterface();
    }

    prepareInterface() {
        this.walletUI.prepareInterface();
    }

    chooseReceiveInfo() {
        this.walletUI.chooseReceiveInfo();
    }

    setCurrency(currency) {
        this.currency = currency;
    }

    getCurrency() {
        return this.currency;
    }

    getCurrentBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                let balanceNative = await this.blockchain.getCurrentBalance();
                return resolve(balanceNative);
            } catch (e) {
                return reject(e);
            }
        })
    }

    getAddress() {
        return new Promise(async (resolve, reject) => {
            try {
                let address = await this.blockchain.getAddress();
                return resolve(address);
            } catch (e) {
                return reject(e);
            }
        })
    }

    sendCurrency(to, amount) {
        return new Promise(async (resolve, reject) => {
            try {
                let resultSendCurrency = await this.blockchain.sendCurrency(to, amount);
                return resolve(resultSendCurrency);
            } catch (e) {
                return reject(e);
            }
        })
    }

    generateMnemonic() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.blockchain.generateMnemonic();
                await this.blockchain.credentials._setMnemonic(result);
                app.prepareInterface();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }

    importMnemonic(mnemonic) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.blockchain.importMnemonic(mnemonic);
                app.prepareInterface();
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        })
    }

    // getNonce(){
    //     return new Promise(async(resolve, reject)=>{
    //         try{
    //             let nonce = await this.blockchain.getNonce();
    //             return resolve(nonce);
    //         } catch (e){
    //             return reject(e);
    //         }
    //     })
    // }


    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let usdBalance = await this.blockchain.getUsdBalance();
                return resolve(usdBalance.toFixed(2));
            } catch (e){
                return reject(e);
            }
        })
    }

    // isProduction(){
    //     return isProduction;
    // }

}

let app = new Application();
app.chooseReceiveInfo();