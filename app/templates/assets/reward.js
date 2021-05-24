
function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getRewards(addr) {
    fetch('https://clutrack.io/getRewards/' + addr, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
            console.log(data)
            var elem = document.getElementById('rewardStats')
            elem.innerHTML = `
            <div class="columns">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Total Gained<br>1 Minute</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.total_reward_1m) + `</p>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Total Gained<br>3 Minutes</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.total_reward_3m) + `</p>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Avg. RPB Per Minute</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.avg_br_1m) + `</p>
                        <canvas id="minuteChart" width="600" height="200"></canvas>
                    </div>
                </div>
                <div class="column is-half">
                <div class="box">
                    <p class="subtitle"><strong style="color: black">Avg. RPB Per 3 Minutes</strong></p>
                    <p class="subtitle" style="color: black">` + numberWithCommas(data.avg_br_3m) + `</p>
                    <canvas id="threeMinChart" width="600" height="200"></canvas>
                    </div>
                </div>
            </div>`
            var longTerm = document.getElementById('longTermStats')
            if (data.has_12hr !== null && data.has_12hr === true) {
                if (data.has_24hr === true) {
                    longTerm.innerHTML = `
                    <h1 class="title" style="color: black">Lifetime Balance Increase:</h1>
                    <p class="subtitle" style="color: black">` + numberWithCommas(data.lifetime) + `
                    <p class="subtitle" style="color: grey">These numbers include all transfers into your account since you linked with CluTrack. Including buys and people sending to you.</p> 
                    <div class="columns">
                        <div class="column is-half">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>12 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_12hr) + `</p>
                                <canvas id="twelveHourChart" width="600" height="200"></canvas>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>24 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_24hr) + `</p>
                                <canvas id="twentyFourChart" width="600" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    `
                } else {
                    longTerm.innerHTML = `
                    <div class="columns">
                        <div class="column is-fullwidth">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>12 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_12hr) + `</p>
                                <canvas id="twelveHourChart" width="600" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    `
                }
            }
            if (data.has_12hr !== null && data.has_12hr === true) {
                var labels_12 = []
                for (var i = 0; i < 12; i++){
                    labels_12.push('')
                }
                var labels_24 = []
                for (var i = 0; i < 24; i++){
                    labels_24.push('')
                }
                var thCtx = document.getElementById('twelveHourChart').getContext('2d')
                var thChart = new Chart(thCtx, {
                    type: 'line',
                    data: {
                        labels: labels_12,
                        datasets: [{
                            label: 'Balance',
                            data: Object.values(data.bal_24hr),
                            backgroundColor: [
                                'rgba(90, 194, 25, 0.3)'
                            ],
                            borderColor: [
                                'rgba(207, 207, 207, 1)'
                            ],
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                stacked: true
                            }]
                        },
                        elements: {
                            point:{
                                radius: 1
                            }
                        }
                    }
                })
            }
            if (data.has_24hr === true) {
                var tfCtx = document.getElementById('twentyFourChart').getContext('2d')
                var tfChart = new Chart(tfCtx, {
                    type: 'line',
                    data: {
                        labels: labels_24,
                        datasets: [{
                            label: 'Balance',
                            data: Object.values(data.bal_24hr),
                            backgroundColor: [
                                'rgba(90, 194, 25, 0.3)'
                            ],
                            borderColor: [
                                'rgba(207, 207, 207, 1)'
                            ],
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                stacked: true
                            }],
                            xAxes: [{
                                display: true
                            }]
                        },
                        elements: {
                            point:{
                                radius: 1
                            }
                        }
                    }
                })
            }
            var minuteCtx = document.getElementById('minuteChart').getContext('2d')
            var threeMinCtx = document.getElementById('threeMinChart').getContext('2d')
            var minuteChart = new Chart(minuteCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(data.block_data).slice(41, 60),
                    datasets: [{
                        label: 'RPB/min by Block',
                        data: Object.values(data.block_data).slice(41, 60),
                        backgroundColor: [
                            'rgba(90, 194, 25, 0.3)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true
                        }],
                        xAxes: [{
                            display: true
                        }]
                    },
                    elements: {
                        point:{
                            radius: 1
                        }
                    }
                }

            })
            var threeMinChart = new Chart(threeMinCtx, {
                type: 'line',
                data: {
                    labels: [Object.keys(data.block_data)],
                    datasets: [{
                        label: 'RPB/3min by Block',
                        data: Object.values(data.block_data),
                        backgroundColor: [
                            'rgba(90, 194, 25, 0.3)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true
                        }]
                    },
                    elements: {
                        point:{
                            radius: 1
                        }
                    }
                }

            })
            
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
            window.location.reload()
        });
    });
}


function login() {
    let provider
    let signer
    provider = new ethers.providers.Web3Provider(web3.currentProvider);

    provider.getNetwork().then(function (result) {
        if (result['chainId'] != 56){
            document.getElementById("title").textContent = 'Please Switch to the BSC Network!';
            document.getElementById("rusty").disabled = true;
        } else {
            provider.listAccounts().then(function (result) {
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
}