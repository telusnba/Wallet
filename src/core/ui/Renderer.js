const Application = require('../../js/index');
const {Web3} = require("web3");
const QRCode = require("qrcode");
class Renderer {

    constructor(app) {
        this.app = app;
    }

    renderUI(){
        this.renderCurrency();
        this.renderBalance();
        this.renderAddress();
        this.renderReceiveInfo();
        this.renderInfoInAccountChoose();
        // this.renderTransactionCount();
        this.renderUsdBalance();
    }

    renderCurrency(){
        let elements = document.getElementsByClassName("currencySymbol");
        for (let i= 0; i < elements.length; i++){
            let element = elements[i];
            element.innerText = this.app.getCurrency();
        }
    }

    renderBalance(){
        let element = document.getElementById("currencyBalance");
        this.app.getCurrentBalance().then((balanceNative)=>{
            element.innerText = balanceNative;
        })
    }

    renderAddress(){
        let curr = this.app.getCurrency();
        let element = document.getElementById("userAddress");
        this.app.getAddress().then((address)=>{
            if (curr === 'BTC' || curr === 'LTC'){
                element.innerText = address.slice(0, -27) + "..." + address.slice(-5);
            }else {
                element.innerText = address.slice(0, -35) + "..." + address.slice(-5);
            }
        })
    }

    renderReceiveInfo(){
        this.renderQRCode();
        this.renderSlideAddressQRCode();
    }

    renderAllInfoIfMnemonicExist(){
        this.renderUI();
        this.renderReceiveInfo();
    }

    renderQRCode(){
        let receiveQRCode = document.getElementById("receiveQRCode");
        receiveQRCode.style.display = 'inline';
        this.app.getAddress().then((address) => {
            QRCode.toCanvas(receiveQRCode, address, function (error) {
                if (error) {
                    console.error(error);
                } else {
                    console.log('Generate QR Code success!');
                }
            })
        })
    }

    renderSlideAddressQRCode(){
        let receiveQRCodeAddress = document.getElementById("receiveQRCodeAddress");
        let curr = this.app.getCurrency();
        this.app.getAddress().then((address) => {
            receiveQRCodeAddress.innerText = address;
            if (curr === 'BTC' || curr === 'LTC') {
                receiveQRCodeAddress.innerText = address.slice(0, -27) + "..." + address.slice(-5);
            } else {
                receiveQRCodeAddress.innerText = address.slice(0, -35) + "..." + address.slice(-5);
            }
        })
    }

    chooseReceiveInfo(){
        let mnemonic = this.app.blockchain.credentials._getMnemonic();
        if(mnemonic === null || mnemonic === undefined || mnemonic === ""){
            this.renderWalletWithoutInfo();
        } else {
            this.renderAllInfoIfMnemonicExist();
        }
    }

    renderWalletWithoutInfo(){
        let receiveQRCode = document.getElementById("receiveQRCode");
        let receiveQRCodeAddress = document.getElementById("receiveQRCodeAddress");
        let address = document.getElementById("userAddress");
        let addressSelectBlock = document.getElementById("addressSelectBlock");

        receiveQRCode.style.display = 'none';
        receiveQRCodeAddress.innerText = "Import or generate mnemonic";
        address.innerText = "Import or generate mnemonic";
        addressSelectBlock.style.display = 'none';
    }


    renderInfoInAccountChoose(){
        let addressSelectBlock = document.getElementById("addressSelectBlock");
        addressSelectBlock.style.display = 'inline';
        this.renderAddressInAccountChoose();
        this.renderBalanceInAccountChoose();
        this.renderBalanceUsdInAccountChoose();
    }

    renderAddressInAccountChoose(){
        let curr = this.app.getCurrency();
        let addressInAccountChoose = document.getElementById("addressInAccountChoose");
        this.app.getAddress().then((address)=>{
            if (curr === 'BTC' || curr === 'LTC'){
                addressInAccountChoose.innerText = address.slice(0, -27) + "..." + address.slice(-5);
            }else {
                addressInAccountChoose.innerText = address.slice(0, -35) + "..." + address.slice(-5);
            }
        })
    }

    renderBalanceInAccountChoose(){
        let balanceInAccountChoose = document.getElementById("balanceInAccountChoose");
        this.app.getCurrentBalance().then((balanceNative)=>{
            balanceInAccountChoose.innerText = balanceNative + " " + this.app.getCurrency();
        })
    }

    renderBalanceUsdInAccountChoose(){
        let balanceUsdInAccountChoose = document.getElementById("balanceUsdInAccountChoose");
        let curr = this.app.getCurrency();
        this.app.getUsdBalance().then((usdBalance)=>{
            if (usdBalance === 0){
                balanceUsdInAccountChoose.innerText = "0 USD";
            } else if(curr === 'ERC20'){
                balanceUsdInAccountChoose.innerText = "0 USD";
            } else {
                balanceUsdInAccountChoose.innerText = usdBalance + " USD";
            }
        })
    }


    // renderTransactionCount() {
    //     this.app.getNonce().then((nonce)=>{
    //         console.log("Nonce count - " + nonce);
    //     })
    // }

    renderUsdBalance(){
        let usdBalanceField = document.getElementById("usdBalance");
        let curr = this.app.getCurrency();
        this.app.getUsdBalance().then((usdBalance)=>{
            if (usdBalance === 0){
                usdBalanceField.innerText = "0 USD";
            }else if(curr === 'ERC20'){
                usdBalanceField.innerText = "0 USD";
            }else {
                usdBalanceField.innerText = usdBalance + " USD";
            }
        })
    }

}
module.exports = Renderer;