const {ECPair,TransactionBuilder,networks} = require('bitcoinjs-lib');
const AbstractCurrencyLib = require('../AbstractCurrencyLib');
const BtcConverter = require('/src/core/helpers/BtcConverter');
const BtcValidator = require('/src/core/validators/blockchain/BtcValidator');
const BlockcypherProvider = require('./BlockcypherProvider');

const BTCNETWORK = networks.testnet;

let USD_API_TOKEN = process.env.USD_API_TOKEN;
const urlRateUsd = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD&api_key=${USD_API_TOKEN}`;

class BtcLib extends AbstractCurrencyLib{

    constructor(app) {
        let validator = new BtcValidator();
        let converter = new BtcConverter();
        let provider = new BlockcypherProvider(app, validator, converter);
        super(app, provider, validator, converter);
    }

    _getNetwork(){
        // if(this.app.isProduction()){
        //     return networks.bitcoin;
        // } else {
        //     return networks.testnet;
        // }
        return BTCNETWORK;
    }

    getBalance(address){
        return new Promise(async(resolve, reject)=>{
            try{
                this.validator.validateAddress(address);
                let balance = await this.provider.getBalance(address);
                balance = this.converter.toDecimals(balance);
                return resolve(balance);
            } catch (e){
                return reject(e);
            }
        });
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                console.log("btcLib send currency start");
                let txData = await this._formatTransactionParams(to, amount);
                console.log("btcLib send currency formatTxParams", txData);
                let rawTx = await this._createSignRawTx(txData);
                console.log("btcLib send currency rawTx", rawTx);
                let hash = await this.provider.sendTx(rawTx);
                return resolve(hash);
            } catch (e){
                return reject(e);
            }
        });
    }

    _formatTransactionParams(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                let from = await this.getAddress();
                let fee = await this.getFee();
                console.log('formatTxParams fee',fee)
                amount = parseFloat(amount);
                console.log('formatTxParams amount',amount)
                this.validator.validateAddress(to);
                this.validator.validateNumber(amount);
                this.validator.validateNumber(fee);
                console.log('formatTxParams validate over')
                amount = this.fromDecimals(amount);
                fee = this.fromDecimals(fee);
                console.log('formatTxParams afterDecimals',fee)
                amount = Math.round(amount);
                fee = Math.round(fee);
                console.log('formatTxParams before txParams',amount)
                let txParams={
                    from:from,
                    to:to,
                    amount:amount,
                    fee:fee
                }
                console.log('formatTxParams txDParams',txParams)
                return resolve(txParams);
            }catch (e){
                return reject(e);
            }
        })
    }

    _createSignRawTx(txParams){
        return new Promise(async(resolve,reject)=>{
            try {
                console.log("btc lib createSignRawTx");
                let privateKey = this.getPrivateKey();

                let keyring = await ECPair.fromWIF(privateKey, this._getNetwork());
                console.log("keyring",keyring);
                console.log("btcLib txb")
                let txb = new TransactionBuilder(this._getNetwork());
                console.log("btcLib addSignedUtxos");
                txb = await this.provider.addSignedUtxos(keyring,txb,txParams["from"],txParams["to"],txParams["amount"],txParams["fee"]);
                console.log("btcLib txb")
                let txHash = txb.build().toHex();
                this.validator.validateString(txHash,'txHash');
                console.log('_createSignRawTx end txHash ',txHash);
                return resolve(txHash)
            }catch (e){
                return reject(e);
            }
        })
    }

    getFee(){
        return new Promise(async(resolve,reject)=>{
            try{
                let fee = await this.provider.getFee()
                console.log("btcLib getFee",fee);
                return resolve(fee);
            }catch(e){
                return reject(e)
            }
        })
    }

    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.getAddress();

                let balanceNative = await this.getBalance(address);
                let rateUsd = await this.provider.getRequest(urlRateUsd);

                let rate = rateUsd.BTC.USD;

                let usdBalance = balanceNative * rate;
                console.log(`USD BALANCE - ${balanceNative} * ${rate} = `+ usdBalance);

                return resolve(usdBalance);
            } catch (e){
                return reject(e);
            }
        });
    }

}

module.exports = BtcLib;