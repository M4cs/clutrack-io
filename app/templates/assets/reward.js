function getRewards(addr) {
    fetch('https://clutrack.io/getRewards/' + addr, {
        method: 'get',
        headers: {'Content-Type': 'application/json'}
    }).then((response) => {
        response.json().then(data => {
            console.log(data)
            var elem = document.getElementById('rewardStats')
            elem.innerHTML = `<div class="columns">
            <div class="column is-half">
                <div class="box">
                    <p class="subtitle"><strong style="color: black">Avg. RPB Per Minute</strong></p>
                    <p class="subtitle" style="color: black">` + data.avg_br_1m.toString() + `</p>
                </div>
            </div>
            <div class="column is-half">
              <div class="box">
                  <p class="subtitle"><strong style="color: black">Avg. RPB Per 3 Minutes</strong></p>
                  <p class="subtitle" style="color: black">` + data.avg_br_3m.toString() + `</p>
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
        })
    })
}