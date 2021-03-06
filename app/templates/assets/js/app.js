let provider;
let accounts;

let accountAddress = "";
let signer;

function sign() {
    ethereum.enable().then(function () {
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
    
        provider.getNetwork().then(function (result) {
            if (result['chainId'] != 56){
                document.getElementById("title").textContent = 'Please Switch to the Binance Smart Chain Network!';
                document.getElementById("rusty").disabled = true;
            } else {
                provider.listAccounts().then(function (result) {
                    console.log(result);
                    accountAddress = result[0];
                    signer = provider.getSigner();
                    now = (Date.now()/1000).toFixed(0);
                    near = now-(now%600);
                    var message = "Signing message to https://clutrack.io at " + near
                    var message_hash = ethers.utils.hashMessage(message + ":" + message.length.toString())
                    signer.signMessage(message + ":" + message.length.toString(), accountAddress, "1234567890!!!").then((signature) => {
                        handleAuth(accountAddress, signature, message_hash)
                    });
                })
            }
        })
    })
}

function handleAuth(accountAddress, signature, message_hash) {
    fetch('https://clutrack.io/sign', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "wallet_address": accountAddress,
            "sig": signature,
            "hash": message_hash
        })
    }).then((response) => {
        response.json().then(data => {
            window.location = data.redirect;
        });
    });
}


function handleDelete(accountAddress, signature, message_hash) {
    fetch('https://clutrack.io/removeAccount', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "wallet_address": accountAddress,
            "sig": signature,
            "hash": message_hash
        })
    }).then((response) => {
        response.json().then(data => {
            window.location = data.redirect
        });
    });
}


function removeAccount() {
    ethereum.enable().then(function () {
        provider = new ethers.providers.Web3Provider(web3.currentProvider);
    
        provider.getNetwork().then(function (result) {
            if (result['chainId'] != 56){
                document.getElementById("title").textContent = 'Please Switch to the BSC Network!';
                document.getElementById("rusty").disabled = true;
            } else {
                provider.listAccounts().then(function (result) {
                    console.log(result);
                    accountAddress = result[0];
                    signer = provider.getSigner();
                    now = (Date.now()/1000).toFixed(0);
                    near = now-(now%600);
                    var message = "DELETE ACCOUNT | Signing message to http://localhost:5000 at " + near
                    var message_hash = ethers.utils.hashMessage(message + ":" + message.length.toString())
                    signer.signMessage(message + ":" + message.length.toString(), accountAddress, "1234567890!!!").then((signature) => {
                        handleDelete(accountAddress, signature, message_hash)
                    });
                })
            }
        })
    })
}