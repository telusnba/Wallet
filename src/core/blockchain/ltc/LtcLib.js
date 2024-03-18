const BtcLib = require('/src/core/blockchain/btc/BtcLib');
const LtcBlockcypherProvider = require('/src/core/blockchain/ltc/LtcBlockcypherProvider');
const LtcValidator = require('/src/core/validators/blockchain/LtcValidator')
const LtcConverter = require('/src/core/helpers/LtcConverter');

const NETWORK = require('/src/core/blockchain/ltc/LtcNetworks')["main"];

let USD_API_TOKEN = process.env.USD_API_TOKEN;
const urlRateUsd = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=LTC&tsyms=USD&api_key=${USD_API_TOKEN}`;

class LtcLib extends BtcLib{
    constructor(app) {
        super(app);
        this.validator = new LtcValidator();
        this.converter = new LtcConverter();
        this.provider = new LtcBlockcypherProvider(app,this.validator,this.converter);
    }
    _getNetwork(){
        return NETWORK;
    }

    getUsdBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.getAddress();

                let balanceNative = await this.getBalance(address);
                let rateUsd = await this.provider.getRequest(urlRateUsd);

                let rate = rateUsd.LTC.USD;

                let usdBalance = balanceNative * rate;
                console.log(`USD BALANCE - ${balanceNative} * ${rate} = `+ usdBalance);

                return resolve(usdBalance);
            } catch (e){
                return reject(e);
            }
        });
    }
}
module.exports = LtcLib;