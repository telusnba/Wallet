const Web3 = require('web3');

let PROVIDER_URL = process.env.BNB_PROVIDER_URL;
const EthLib = require('../eth/EthLib');
const BnbValidator = require("../../validators/blockchain/BnbValidator");
const BnbConverter = require("../../helpers/Erc20Converter");

let USD_API_TOKEN = process.env.USD_API_TOKEN;
const urlRateUsd = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BNB&tsyms=USD&api_key=${USD_API_TOKEN}`;

class BnbLib extends EthLib{
    constructor(app) {
        super(app);
        this.validator = new BnbValidator();
        this.converter = new BnbConverter();
        this.provider = new Web3(new Web3.providers.HttpProvider(PROVIDER_URL));
    }

    _getChainId(){
        // if(this.app.isProduction()){
        //     return 56;
        // } else {
        //     return 97;
        // }
        return 97;
    }

    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.app.getAddress();

                let balanceNative = await this.provider.eth.getBalance(address);
                balanceNative =  this.converter.toDecimals(balanceNative);

                let rateUsd = await this.getRequest(urlRateUsd);
                let rate = rateUsd.BNB.USD;

                let usdBalance = balanceNative * rate;
                console.log(`USD BALANCE - ${balanceNative} * ${rate} = `+ usdBalance);

                return resolve(usdBalance);
            } catch (e){
                return reject(e);
            }
        });
    }

}

module.exports = BnbLib;