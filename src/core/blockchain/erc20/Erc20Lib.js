const EthLib = require('../eth/EthLib');
const Erc20Abi = require('./Erc20Abi');
const Erc20Converter = require('/src/core/helpers/Erc20Converter');

let erc20ContractAddress = process.env.ERC20_CONTRACT_ADDRESS;

let GAS_LIMIT = 300000;

class Erc20Lib extends EthLib{

    constructor(app) {
        super(app);
        this.setContract();
        this.converter = new Erc20Converter();
    }

    composeContract(){
        return new this.provider.eth.Contract(Erc20Abi, this.getContractAddress());
    }

    setContract(){
        this.contract = this.composeContract();
    }
    getContractAddress(){
        return erc20ContractAddress;
    }

    getContract(){
        return this.contract;
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
                this.validator.validateAddress(address);
                let balanceNative = await this.getContract().methods.balanceOf(address).call();
                balanceNative = this.converter.toDecimals(balanceNative);
                return resolve(balanceNative);
            } catch (e){
                return reject(e);
            }
        });
    }

    sendCurrency(to, amount){
        return new Promise(async(resolve, reject)=>{
            try{
                amount = this.fromDecimals(amount);
                amount = amount.toString();
                let data = this.getContract().methods.transfer(to, amount).encodeABI();
                let txData = await this._formatTransactionParams(this.getContractAddress(), "0", data);
                let hash = await this._makeTransaction(txData);
                return resolve(hash);
            } catch (e){
                return reject(e);
            }
        });
    }

    getGasLimit(){
        return GAS_LIMIT;
    }


    getSymbol(){
        return new Promise(async(resolve, reject)=>{
            try{
                    let symbol = await this.getContract().methods.symbol().call();
                console.log("symbol erc20 " + symbol);
                return resolve(symbol);
            } catch (e){
                return reject(e);
            }
        });
    }

}

module.exports = Erc20Lib;