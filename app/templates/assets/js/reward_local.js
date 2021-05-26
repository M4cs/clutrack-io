
function numberWithCommas(x, precision = -1) {
    // precision is not negative, so round to the specified number of places
    if (precision >= 0) {
        x = (x * 1).toFixed(precision);
    }

    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getRewards(addr) {
    var currentPrice = 0
    fetch('http://localhost:5000/getPrice',{
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
            if (data != null) {
                currentPrice = data.price
            }
        })
    })
    fetch('http://localhost:5000/getRewards/' + addr, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
            var title = document.getElementById('mainTitle')
            title.innerText = "Displaying Rewards for Wallet:"
            var realtimeBalance = document.getElementById('realtimeBalance')
            realtimeBalance.innerHTML = `
            <div class="container has-text-centered">
                <p class="subtitle">
                    Current Balance: 🚀 <span style="color: deeppink">` + numberWithCommas(data.current_balance.toPrecision(12), 9) + `</span>
                    (<span style="color: green">USD $` + numberWithCommas(1 * (currentPrice * data.current_balance).toPrecision(12), 2) + `</span>
                    <span style="color: gray; font-size: 12px; vertical-align:middle; line-height:normal; margin-bottom:4px">@ $` + numberWithCommas(currentPrice, 12) + ` / CLU</span>)
                    <br><br><br>
                </p>
            </div>
            <br>
            `
            var rewardStats = document.getElementById('rewardStats')
            var avgRewardPerSecond = data.total_reward_3m / 180
            var rewardPerMinute = avgRewardPerSecond * 60
            var rewardPerHour = rewardPerMinute * 60
            var rewardPerDay = rewardPerHour * 24
            var rewardPerMonth = rewardPerDay * 30            
            rewardStats.innerHTML = `
            <div class="columns is-desktop">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle">
                            <strong style="color: black">Reflection Rate</strong><br>
                            <span style="color: gray">3 Minutes</span>
                        </p>
                        <p class="subtitle" style="color: magenta">CLU per Second 🚀` +  numberWithCommas(1 * (avgRewardPerSecond).toPrecision(12)) + `</p>
                        <p class="subtitle" style="color: green">USD per Second $` +  numberWithCommas(1 * (avgRewardPerSecond * currentPrice).toPrecision(8))  + `</p>
                        <p style="line-height:50%" />
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <button type="button"
                                class="btn btn-info btn-sm"
                                style="float:right; background-color: lightgray; color: black; border: none"
                                data-toggle="modal"
                                data-target="#disclaimerDialog">?</button>
                        <p class="subtitle">
                            <span>
                                <strong style="color: black">
                                &nbsp;&nbsp;Projections
                                <sup style="font-size:10px; background-color: lightgray">
                                BETA
                                </sup>
                            </strong>
                            </span><br>
                            <span style="color: gray">Reflection Rate * Market Price * Time</span>
                        </p>
                        <table class="center" style="text-align:right; width:70%">
                        <thead style="table-header-group">
                        <tr>
                            <th>Timeframe</th>
                            <th>Projected Value</th>
                        </tr>
                        </thead>
                        <tbody style="display:table-row-group; font-weight: normal">
                        <tr>
                            <td width="50%">per Hour</td>
                            <td style="color: green">USD $` +  numberWithCommas(1 * (rewardPerHour * currentPrice).toPrecision(8)) + `</td>
                        </tr>
                        <tr>
                            <td width="50%">per Day</td>
                            <td style="color: green">USD $` +  numberWithCommas(1 * (rewardPerDay * currentPrice).toPrecision(2)) + `</td>
                        </tr>
                        <tr>
                            <td width="50%">per Month</td>
                            <td style="color: green">USD $` +  numberWithCommas(1 * (rewardPerMonth * currentPrice).toPrecision(2)) + `</td>
                        </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="columns is-desktop">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle">
                            <strong style="color: black">Total Gained</strong><br>
                            <span style="color: gray">1 Minute</span>
                        </p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.total_reward_1m) + `<br>$` + numberWithCommas(1 * (data.total_reward_1m * currentPrice).toPrecision(12)) + `</p>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Total Gained<br>3 Minutes</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.total_reward_3m) + `<br>$` + numberWithCommas(1 * (data.total_reward_3m * currentPrice).toPrecision(12)) + `</p>
                    </div>
                </div>
            </div>
            <div class="columns is-desktop">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Avg. RPB Per Minute</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.avg_br_1m) + `<br>$` + numberWithCommas(1 * (data.avg_br_1m * currentPrice).toPrecision(12)) + `</p>
                        <canvas id="minuteChart" height="200"></canvas>
                    </div>
                </div>
                <div class="column is-half">
                <div class="box">
                    <p class="subtitle"><strong style="color: black">Avg. RPB Per 3 Minutes</strong></p>
                    <p class="subtitle" style="color: black">` + numberWithCommas(data.avg_br_3m) + `<br>$` + numberWithCommas(1 * (data.avg_br_3m * currentPrice).toPrecision(12)) + `</p>
                    <canvas id="threeMinChart" height="200"></canvas>
                    </div>
                </div>
            </div>`
            var longTerm = document.getElementById('longTermStats')
            if (data.has_12hr !== null && data.has_12hr === true) {
                if (data.has_24hr === true) {
                    longTerm.innerHTML = `
                    <br><br>
                    <h1 class="title fancyTitle">Lifetime Balance Increase:</h1>
                    <p class="subtitle fancyTitle">` + numberWithCommas(data.lifetime) + `<br>$` + numberWithCommas(1 * (data.lifetime * currentPrice).toPrecision(12)) + `</p>
                    <p class="subtitle" style="color: grey">These numbers include all transfers into your account since you linked with CluTrack. Including buys and people sending to you.</p> 
                    <div class="columns is-desktop">
                        <div class="column is-half">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>12 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_12hr) + `<br>$` + numberWithCommas(1 * (data.total_12hr * currentPrice).toPrecision(12)) + `</p>
                                <canvas id="twelveHourChart" height="200"></canvas>
                            </div>
                        </div>
                        <div class="column is-half">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>24 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_24hr) + `<br>$` + numberWithCommas(1 * (data.total_24hr * currentPrice).toPrecision(12)) + `</p>
                                <canvas id="twentyFourChart" height="200"></canvas>
                            </div>
                        </div>
                    </div>
                    `
                } else {
                    longTerm.innerHTML = `
                    <br><br>
                    <h1 class="title fancyTitle">Lifetime Balance Increase:</h1>
                    <p class="subtitle fancyTitle">` + numberWithCommas(data.lifetime) + `<br>$` + numberWithCommas(1 * (data.lifetime * currentPrice).toPrecision(12)) + `</p>
                    <p class="subtitle" style="color: grey">These numbers include all transfers into your account since you linked with CluTrack. Including buys and people sending to you.</p>
                    <div class="columns is-desktop">
                        <div class="column is-fullwidth">
                            <div class="box">
                                <p class="subtitle"><strong style="color: black">Total Gained<br>12 Hours</strong></p>
                                <p class="subtitle" style="color: black">` + numberWithCommas(data.total_12hr) + `<br>$` + numberWithCommas(1 * (data.total_12hr * currentPrice).toPrecision(12)) + `</p>
                                <canvas id="twelveHourChart" height="200"></canvas>
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
                            data: Object.values(data.bal_12hr),
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
                        responsive: true,
                        maintainAspectRation: false,
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
                        responsive: true,
                        maintainAspectRation: false,
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
                    responsive: true,
                    maintainAspectRation: false,
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
            var threeMinChart = new Chart(threeMinCtx, {
                type: 'line',
                data: {
                    labels: Object.keys(data.block_data),
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
                    responsive: true,
                    maintainAspectRation: false,
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
    fetch('http://localhost:5000/sign', {
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
                var message = "Signing message to http://localhost:5000 at " + near
                var message_hash = ethers.utils.hashMessage(message + ":" + message.length.toString())
                signer.signMessage(message + ":" + message.length.toString(), accountAddress, "1234567890!!!").then((signature) => {
                    handleAuth(accountAddress, signature, message_hash)
                });
            })
        }
    })
}


function handleDelete(accountAddress, signature, message_hash) {
    fetch('http://localhost:5000/removeAccount', {
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