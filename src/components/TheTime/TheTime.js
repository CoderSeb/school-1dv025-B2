
const template = document.createElement('template')
template.innerHTML = `
<style>
  .secondBox {
    min-width:fit-content;
    width:370px;
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
    this._startCountDownTimer = this._startCountDownTimer.bind(this)
      this.timeLimit = document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-time')
    this._defaultTime
    this.answerBtn = document.querySelector('the-quiz-app').shadowRoot
      .querySelector('question-and-answers').shadowRoot.querySelector('#inputSendBtn')
    this.answerList = document.querySelector('the-quiz-app').shadowRoot
      .querySelector('question-and-answers').shadowRoot.querySelector('#a-list')
    this.startedCounter = false
    this.timeLeft = this.shadowRoot.querySelector('.time')
    this.scoreCounter
    this.scoreBoard = document.querySelector('the-quiz-app').shadowRoot
      .querySelector('question-and-answers').shadowRoot.querySelector('quiz-highscore')
  }

  connectedCallback() {
    // Called when created
  }

  disconnectedCallback() {
    // Called when removed
  }

  static get observedAttributes() {
    return ['timelimit', 'timesup']
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'timelimit') {
      this._defaultTime = newValue
      clearInterval(this.timer)
      this._startCountDownTimer()
    }
    if (name === 'timesup') {
      if (newValue === 'true') {
        clearInterval(this.timer)
      }
    }
  }

  _startCountDownTimer() {
      let initialTime = this._defaultTime
      this.timer = setInterval(() => {
       if (initialTime <= 0) {
         clearInterval(this.timer)
       }
        this.timeLeft.innerText = initialTime
        this.scoreCounter = this._defaultTime - this.timeLeft.innerText
        initialTime -= 1
     }, 1000)
     this.scoreBoard.setAttribute('score', this.scoreCounter)
   }
})

