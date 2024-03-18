const Renderer = require('./Renderer');
const ListenerSetter = require('./ListenerSetter');
// const GenerateQRCode = require('https://cdn.jsdelivr.net/npm/qrcode-js-package@1.0.4/qrcode.min.js');
const QRCode = require('qrcode');

class WalletUI{
    constructor(app) {
        this.app = app;
        this.renderer = new Renderer(app);
        this.listenerSetter = new ListenerSetter(app);
        this.listenerSetter.setEventListeners();
    }

    prepareInterface(){
        this.renderer.renderUI();
        this.copyFullAddress();
        this.copyFullAddressQr();
    }

    chooseReceiveInfo(){
        this.renderer.chooseReceiveInfo();
        this.copyFullAddress();
        this.copyFullAddressQr();
    }

    copyFullAddress() {
        this.app.getAddress().then((address) => {
            document.getElementById("userAddress").addEventListener('click', function () {
                navigator.clipboard.writeText(address).then(() => {
                    console.log('Address copied to clipboard - ' + address);
                });
            });
        })
    }

    copyFullAddressQr(){
        this.app.getAddress().then((address) => {
            document.getElementById("receiveQRCodeAddress").addEventListener('click', function () {
                navigator.clipboard.writeText(address).then(() => {
                    console.log('Address copied to clipboard - ' + address);
                });
            });
        })
    }
}

module.exports = WalletUI;