function getRewards(addr) {
    fetch('https://clutrack.io/getRewards/' + addr, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
            console.log(data)
            console.log(data.block_data)
            var elem = document.getElementById('rewardStats')
            elem.innerHTML = `<div class="columns">
            <div class="column is-half">
                <div class="box">
                    <p class="subtitle"><strong style="color: black">Avg. RPB Per Minute</strong></p>
                    <p class="subtitle" style="color: black">` + data.avg_br_1m.toString() + `</p>
                    <canvas id="minuteChart" width="600" height="200"></canvas>
                </div>
            </div>
            <div class="column is-half">
              <div class="box">
                  <p class="subtitle"><strong style="color: black">Avg. RPB Per 3 Minutes</strong></p>
                  <p class="subtitle" style="color: black">` + data.avg_br_3m.toString() + `</p>
                  <canvas id="threeMinChart" width="600" height="200"></canvas>
                  </div>
            </div>
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Total Gained<br>1 Minute</strong></p>
                        <p class="subtitle" style="color: black">` + data.total_reward_1m.toString() + `</p>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Total Gained<br>3 Minutes</strong></p>
                        <p class="subtitle" style="color: black">` + data.total_reward_3m.toString() + `</p>
                    </div>
                </div>
            </div>
            <div class="columns">
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Balance Change<br>1 Day</strong></p>
                        <p class="subtitle" style="color: black">` + data.tfhr_increase.toString() + `</p>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="box">
                        <p class="subtitle"><strong style="color: black">Balance Change<br>1 Week</strong></p>
                        <p class="subtitle" style="color: black">` + data.wk_increase.toString() + `</p>
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
                            'rgba(90, 194, 25, 0.2)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 1
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
                            'rgba(90, 194, 25, 0.2)'
                        ],
                        borderColor: [
                            'rgba(207, 207, 207, 1)'
                        ],
                        borderWidth: 2,
                        tension: 0.1
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