/**
 * The time component.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define a template.
 */
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

/**
 * Define a custom element.
 */
customElements.define('quiz-time',
  class TheTime extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Binds the method.
      this._startCountDownTimer = this._startCountDownTimer.bind(this)

      // Get the highscore component
      this.scoreBoard = document.querySelector('the-quiz-app').shadowRoot
        .querySelector('question-and-answers').shadowRoot.querySelector('quiz-highscore')

      // Get the time header where the time is displayed.
      this.timeLeft = this.shadowRoot.querySelector('.time')

      // Defining variables.
      this.startedCounter = false
      this._defaultTime = null
      this.scoreCounter = null
    }

    connectedCallback () {
    // Called when created
    }

    disconnectedCallback () {
    // Called when removed
    }

    /**
     * Attributes to be observed.
     *
     * @returns {string[]} A string array with the attributes to monitor.
     */
    static get observedAttributes () {
      return ['timelimit', 'timesup']
    }

    /**
     * Called when the observed attribute(s) changes.
     *
     * @param {string} name - The attribute name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
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

    /**
     * The timer method which counts down from the default time and
     * sets the score attribute on the highscore component based
     * on seconds passed on the counter.
     */
    _startCountDownTimer () {
      let initialTime = this._defaultTime
      this.timer = setInterval(() => {
        if (initialTime <= 0) {
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('question-and-answers').shadowRoot
            .querySelector('quiz-highscore')
            .setAttribute('gamestopped', 'true')
          this.setAttribute('timesup', 'true')
          document.querySelector('the-quiz-app')
            .shadowRoot.querySelector('question-and-answers')
            .shadowRoot.querySelector('.scoreboard').style.display = 'block'
          document.querySelector('the-quiz-app')
            .shadowRoot.querySelector('question-and-answers')
            .shadowRoot.querySelector('.q-head').style.display = 'none'
          document.querySelector('the-quiz-app')
            .shadowRoot.querySelector('question-and-answers')
            .shadowRoot.querySelector('.a-div').style.display = 'none'
          clearInterval(this.timer)
        }
        this.timeLeft.innerText = initialTime
        this.scoreCounter = this._defaultTime - this.timeLeft.innerText
        initialTime -= 1
      }, 1000)
      this.scoreBoard.setAttribute('score', this.scoreCounter)
    }
  })
