const template = document.createElement('template')
template.innerHTML = `
<style>
  .secondBox {
    width:400px;
    height:95%;
    padding:1em;
    text-align:center;
    background:blue;
    color:white;
    border-radius:10px;
    opacity:0.8;
  }

  .time {
    margin-top:40%;
    font-size:19em;
  }

  .timeHeader {
    font-size:4em;
  }
</style>

<div class="secondBox">
  <h1 class="timeHeader">TIME</h1>
  <h1 class="time">0</h1>
</div>
`

customElements.define('quiz-time',
class TheTime extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
    this._defaultTime = 20
    this.countDownTimer = this.countDownTimer.bind(this)
  }

  connectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').addEventListener('click', 
    this.countDownTimer)
  }

  countDownTimer() {
    let initialTime = this._defaultTime
    const counter = setInterval(() => {
      if (initialTime <= 0) {
        clearInterval(counter)
      }
      document.querySelector('the-quiz-app')
      .shadowRoot.querySelector('quiz-time')
      .shadowRoot.querySelector('.time').innerText = initialTime
      initialTime -= 1
    }, 1000)
  }
})

