const Web3 = require('web3');
const Transaction = require('ethereumjs-tx');
const EthConverter = require('/src/core/helpers/EthConverter');
const Validator = require('/src/core/validators/blockchain/EthValidator');


const AbstractCurrencyLib = require('../AbstractCurrencyLib');

let PROVIDER_URL = process.env.ETH_PROVIDER_URL;
let USD_API_TOKEN = process.env.USD_API_TOKEN;

let GWEI = 10**9;
let GAS_PRICE = 100 * GWEI;
let GAS_LIMIT = 21000;

const urlRateUsd = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD&api_key=${USD_API_TOKEN}`;
const PROBLEM_WITH_NODE = "PROBLEM_WITH_NODE";

class EthLib extends AbstractCurrencyLib{
    constructor(app) {
        let web3 = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
        let converter = new EthConverter();
        let validator = new Validator();
        super(app, web3, validator, converter);
    }

    getBalance(address){
        return new Promise(async(resolve, reject)=>{
            try{
                this.validator.validateAddress(address);
                let balanceNative = await this.provider.eth.getBalance(address);
                balanceNative = this.provider.utils.fromWei(balanceNative, 'ether').slice(0, 6);
                return resolve(balanceNative);
            } catch (e){
                return reject(e);
            }
        });
    }


    sendCurrency(to,amount){
        return new Promise(async(resolve,reject)=>{
            try{
                this.validator.validateAddress(to,"Tx Receiver");
                this.validator.validateNumber(amount,"sendCurrency amount");
                amount = amount.toString();
                let txData = await this._formatTransactionParams(to,amount);
                let hash = await this._makeTransaction(txData);
                return resolve(hash);
            }catch (e){
                return reject(e);
            }
        });
    }

    _getChainId(){
        // if(this.app.isProduction()){
        //     return 1;
        // } else {
        //     return 11155111;
        // }
        return 11155111;
    }

    _formatTransactionParams(to, value, data = ""){
        return new Promise(async(resolve, reject)=>{
            try{
                this.validator.validateAddress(to);
                this.validator.validateNumber(value);
                this.validator.validateString(data);

                let privateKey = await this.getPrivateKey();
                this.validator.validateString(privateKey);

                let privKeyBuffer=Buffer.from(privateKey,'hex');

                let from = await this.getAddress();
                let nonce = await this.getNextNonce();

                this.validator.validateAddress(from);
                this.validator.validateNumber(nonce);

                let gasPrice = this.getGasPrice();
                this.validator.validateNumber(gasPrice);

                let gasLimit = this.getGasLimit();
                this.validator.validateNumber(gasLimit);

                let chainId = this._getChainId();
                this.validator.validateNumber(chainId);

                value = this.fromDecimals(value);

                let txParams = {
                    "from":from,
                    "to":to,
                    "privateKey":privKeyBuffer,
                    "value":this.provider.utils.numberToHex(value),
                    "gasPrice":this.provider.utils.numberToHex(gasPrice),
                    "gasLimit":gasLimit,
                    "nonce":nonce,
                    "data":data,
                    "chainId":chainId
                };
                return resolve(txParams);
            } catch (e){
                return reject(e);
            }
        });
    }

    getNextNonce(){
        return new Promise(async(resolve,reject)=>{
            try{
                let address = await this.getAddress();
                let nonce = await this.provider.eth.getTransactionCount(address);
                return resolve(nonce);
            }catch (e){
                return reject(e)
            }
        });
    }

    getGasPrice(){
        return GAS_PRICE;
    }

    getGasLimit(){
        return GAS_LIMIT;
    }

    _makeTransaction(txParams){
        return new Promise(async (resolve,reject)=>{
            try{
                let tx = new Transaction(txParams);
                console.log(tx);
                tx.sign(txParams.privateKey);
                var raw = "0x"+tx.serialize().toString('hex');

                this.provider.eth.sendSignedTransaction(raw).on("receipt",(data)=>{
                    console.log(data);
                    let transactionHash = data["transactionHash"];
                    return resolve(transactionHash);
                }).on("error",(e)=>{
                    console.error(e);
                    return reject(e);
                });

            }catch(e){
                return reject(e);
            }
        });
    }

    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.app.getAddress();

                let balanceNative = await this.provider.eth.getBalance(address);
                balanceNative =  this.provider.utils.fromWei(balanceNative, 'ether');

                let rateUsd = await this.getRequest(urlRateUsd);
                let rate = rateUsd.ETH.USD;

                let usdBalance = balanceNative * rate;
                console.log(`USD BALANCE - ${balanceNative} * ${rate} = `+ usdBalance);

                return resolve(usdBalance);
            } catch (e){
                return reject(e);
            }
        });
    }

    getRequest(url){
        return new Promise(async(resolve,reject)=>{
            try{
                let response = null;
                try{
                    response = await this.app.httpService.getRequest(url);
                }catch (e){
                    throw PROBLEM_WITH_NODE;
                }
                let result = await response.json();
                return resolve(result);
            }catch (e){
                return reject(e);
            }
        })
    }

}

module.exports = EthLib;