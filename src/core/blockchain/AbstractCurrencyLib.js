const Validator = require("../validators/Validator");
const staticValidator = new Validator();
class AbstractCurrencyLib{

    constructor(app, provider, validator, converter) {
        this.app = app;
        staticValidator.validateObject(provider, "provider");
        staticValidator.validateObject(validator, "validator");
        staticValidator.validateObject(converter, "converter");
        this.provider = provider;
        this.validator = validator;
        this.converter = converter;
    }

    getCredentials(){
        return this.app.blockchain.credentials;
    }

    getAddress(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.getCredentials().getAddress();
                return resolve(address);
            } catch (e){
                return reject(e);
            }
        });
    }

    getPrivateKey(){
        return new Promise(async(resolve, reject)=>{
            try{
                let privateKey = await this.getCredentials().getPrivateKey();
                return resolve(privateKey);
            } catch (e){
                return reject(e);
            }
        });

    }

    getCurrentBalance(){
        return new Promise(async(resolve, reject)=>{
            try{
                let address = await this.getAddress();
                let balanceNative = await this.getBalance(address);
                return resolve(balanceNative);
            } catch (e){
                return reject(e);
            }
        });
    }

    getBalance(address){
        return new Promise(async(resolve, reject)=>{
            try{
                throw ("getBalance() not implemented");
            } catch (e){
                return reject(e);
            }
        });
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                throw ("sendCurrency() not implemented");
            } catch (e){
                return reject(e);
            }
        });
    }

    toDecimals(amount){
        return this.converter.toDecimals(amount);
    }
    fromDecimals(amount){
        return this.converter.fromDecimals(amount);
    }

}

module.exports = AbstractCurrencyLib;