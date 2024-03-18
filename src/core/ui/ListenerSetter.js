class ListenerSetter{
    constructor(app) {
        this.app = app;
    }

    setEventListeners(){
        this.setSendListeners();
        this.setChangeCurrencyListener();
        this.setMnemonicListeners();
    }

    setSendListeners(){
        document.getElementById("sendTokensBtn").addEventListener("click", (event)=>{
            let to = document.getElementById("receiverToSent").value;
            let amount = document.getElementById("amountToSent").value;
            this.app.sendCurrency(to, amount).then((result)=>{
                alert(result);
            });
        })
    }

    setChangeCurrencyListener(){
        let selectChain = document.getElementsByClassName('chainSelect');
        for (let i=0; i < selectChain.length; i++){
            selectChain[i].addEventListener("click", (event)=>{
                let chain = event.target;
                let currency = chain.getAttribute("data-value");
                this.app.changeCurrency(currency);
                console.log("Currency - " + currency);
            });
        }
    }

    setMnemonicListeners(){
        this.setGenerateMnemonicListener();
        this.setImportMnemonicOnInputListener();
    }

    setGenerateMnemonicListener(){
        document.getElementById("generateMnemonic").addEventListener("click",async()=>{
            let mnemonic = await this.app.generateMnemonic();
            alert(mnemonic);
        })
    }

    setImportMnemonicOnInputListener(){
        document.getElementById("importMnemonic").addEventListener("input",async()=>{
            let element = event.target || event.srcElement;
            let mnemonic = element.value;
            // console.log(mnemonic);
            this.app.importMnemonic(mnemonic);
        })
    }
}

module.exports = ListenerSetter;