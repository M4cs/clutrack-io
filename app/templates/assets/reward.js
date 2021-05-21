let provider;
let CLU_ABI = [{"inputs":[],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"minTokensBeforeSwap","type":"uint256"}],"name":"MinTokensBeforeSwapUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokensSwapped","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ethReceived","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokensIntoLiqudity","type":"uint256"}],"name":"SwapAndLiquify","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"enabled","type":"bool"}],"name":"SwapAndLiquifyEnabledUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_liquidityFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_maxTxAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_taxFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeFromReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"geUnlockTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeInReward","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcludedFromReward","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"lock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"liquidityFee","type":"uint256"}],"name":"setLiquidityFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"maxTxPercent","type":"uint256"}],"name":"setMaxTxPercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setRestrictionAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_enabled","type":"bool"}],"name":"setSwapAndLiquifyEnabled","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"taxFee","type":"uint256"}],"name":"setTaxFeePercent","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"time","type":"uint256"}],"name":"setTradingStart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"swapAndLiquifyEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"uniswapV2Pair","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"uniswapV2Router","outputs":[{"internalType":"contract IUniswapV2Router02","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"unlock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"whitelistAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

function numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

function getRewards(addr) {
    getRewardsV2(addr)
    fetch('http://localhost:5000/getRewards/' + addr, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
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
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Balance Change<br>1 Day</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.tfhr_increase) + `</p>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Balance Change<br>1 Week</strong></p>
                        <p class="subtitle" style="color: black">` + numberWithCommas(data.wk_increase) + `</p>
                    </div>
                </div>
            </div>`
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
                            'rgba(90, 194, 25, 1)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 2,
                        tension: 0.3
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true
                        }]
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
                            'rgba(90, 194, 25, 1)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 2,
                        tension: 0.3
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            stacked: true
                        }]
                    }
                }

            })
            
        })
    })
}

ethereum.enable().then(function () {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);

    provider.getNetwork().then(function (result) {
        if (result['chainId'] != 56){
            document.getElementById("title").textContent = 'Please Switch to the BSC Network!';
        } else {
            provider.listAccounts().then(function (result) {
                accountAddress = result[0];
                signer = provider.getSigner();
            })
        }
    })
})