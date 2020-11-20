const template = document.createElement('template')
template.innerHTML = `
<style>
  .secondBox {
    min-width:350px;
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
    this.timeLimit = document.querySelector('the-quiz-app').shadowRoot
    .querySelector('quiz-time')
    this._defaultTime = 20
    this.answerBtn = document.querySelector('the-quiz-app').shadowRoot
    .querySelector('question-and-answers').shadowRoot.querySelector('#inputSendBtn')
    this.answerList = document.querySelector('the-quiz-app').shadowRoot
    .querySelector('question-and-answers').shadowRoot.querySelector('#a-list')
    this.startedCounter = false
    this.timer
  }

  connectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').addEventListener('click',
    this._startCountDownTimer)
    document.querySelector('the-quiz-app').shadowRoot.querySelector('question-and-answers').shadowRoot.querySelector('.a-div').addEventListener('click', e => {
      if (e.target === this.answerBtn || e.target.className === 'answerListItem') {
        clearInterval(this.timer)
        this._defaultTime = this.timeLimit.getAttribute('timelimit')
        this._startCountDownTimer()
      }
    })
  }

  disconnectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').removeEventListener('click', 
    this._startCountDownTimer)
  }

  static get observedAttributes() {
    return ['timelimit']
  }

  attributeChangedCallback(name) {
    if (name === 'timelimit') {
      this._defaultTime = this.timeLimit.getAttribute('timelimit')
    }
  }

  _startCountDownTimer() {
      let initialTime = this._defaultTime
      this.timer = setInterval(() => {
       if (initialTime <= 0) {
         clearInterval(this.timer)
         alert('Sorry! Too slow!')
       }
        this.shadowRoot.querySelector('.time').innerText = initialTime
        initialTime -= 1
     }, 1000)
   }
})

