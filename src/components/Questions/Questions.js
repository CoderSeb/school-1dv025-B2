import '../TheTime/TheTime.js'
import '../Highscore/Highscore.js'

const template = document.createElement('template')
template.innerHTML = `

<style>
  #a-list {
    display:none;
    font-size:1.6em;
  }
  #a-list:hover {
    cursor: pointer;
  }

  .ifCorrect {
    display:none;
  }

  .q-input {
    display:none;
    width:300px;
    height:30px;
    border: none;
    border-radius:5px;
    font-size:1.2em;
    outline:none;
    padding:0.5em;
    text-align:center;
  }

  #inputSendBtn {
    display:none;
    width:300px;
    position:absolute;
    top:50%;
    left:10%;
    font-size:1.2em;
    border:none;
    border-radius:5px;
    padding:0.5em;
  }

  #inputSendBtn:hover {
    background:lightgreen;
  }

  #inputSendBtn:active {
    box-shadow:0px 0px 5px 2px black;
  }


  #a-div {
    min-width:50%;
    word-wrap: break-word;
  }

  #a-div > * {
    font-size:1.5em;
    margin-top:1em;
  }

  input[type=radio] {
  transform:scale(1.5);
  margin-right:1em;
  margin-left:5%;
  background:red;
}

.scoreboard {
  display:none;
}


</style>
<div class="q-div">
  <quiz-highscore class="scoreboard"></quiz-highscore>
  <h2 class="q-head" timelimit="20"></h2>
</div>
<div class="a-div">
  <h1 class="ifCorrect"></h1>
  <input class="q-input" maxlength="15" type="text"/>
  <div id="a-div"></div>
  <button id="inputSendBtn">Send answer</button>
</div>
`

customElements.define('question-and-answers',
  class Question extends HTMLElement {
    constructor () {
      super()
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
      this._qURL = 'http://courselab.lnu.se/question/1'
      this.originalURL = 'http://courselab.lnu.se/question/1'
      this._getQuestion = this._getQuestion.bind(this)
      this._postAnswer = this._postAnswer.bind(this)
      this.alternativesDiv = this.shadowRoot.querySelector('#a-div')
      this.alternativesList = this.shadowRoot.querySelectorAll('.radioAlts')
      this.answerInput = this.shadowRoot.querySelector('.q-input')
      this.sendAnswerBtn = this.shadowRoot.querySelector('#inputSendBtn')
      this.timeSlot = document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-time')
      this._answerBtnClicked = this._answerBtnClicked.bind(this)
      this.mainBtn = document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-main-button')
    }

    connectedCallback () {
      this.mainBtn.addEventListener('click', () => {
        this._getQuestion()
      })

      this.answerInput.addEventListener('keyup', () => {
        this.answerInput.id = this.answerInput.value
      })

      this.sendAnswerBtn.addEventListener('click', this._answerBtnClicked)
    }

    disconnectedCallback () {
      document.querySelector('the-quiz-app').shadowRoot
        .querySelector('quiz-start-button').removeEventListener('click', this._getQuestion)

      this.answerInput.removeEventListener('keyup', () => {
        this.answerInput.id = this.answerInput.value
      })

      this.sendAnswerBtn.removeEventListener('click', this._answerBtnClicked)
    }

    _answerBtnClicked () {
      if (this.alternativesDiv.children.length > 0) {
        const alts = this.alternativesDiv.querySelectorAll('.radioAlts')
        for (const alt of alts) {
          if (alt.checked) {
            this._postAnswer(alt)
            this.alternativesDiv.innerHTML = ``
            this.alternativesDiv.style.display = 'none'
          }
        }
      } else {
        this._postAnswer(this.answerInput)
        this.answerInput.style.display = 'none'
      }
    }

    async _getQuestion () {
      if (this.mainBtn.shadowRoot.querySelector('.mainButton').id === 'gameStart') {
      this.shadowRoot.querySelector('.ifCorrect').style.display = 'none'
      const response = await fetch(`${this._qURL}`)
      const result = await response.json()
        .then((result) => {
          this.shadowRoot.querySelector('.q-head').innerText = result.question
          this._qURL = result.nextURL
          if (result.limit) {
            this.timeSlot.setAttribute('timelimit', result.limit)
          } else if (!result.limit) {
            this.timeSlot.setAttribute('timelimit', 20)
          }
          if (result.alternatives) {
            this.alternativesDiv.style.display = 'block'
            this.sendAnswerBtn.style.display = 'block'
            const alternatives = result.alternatives
            this.alternativesDiv.innerHTML = ``
            const values = Object.values(alternatives)
            const keys = Object.keys(alternatives)
            for (let i = 0; i < keys.length; i++) {
              const input = document.createElement('input')
              const label = document.createElement('label')
              const breakRow = document.createElement('br')
              input.id = keys[i]
              input.className = 'radioAlts'
              input.setAttribute('type', 'radio')
              input.name = 'alts'
              input.value = values[i]
              label.setAttribute('for', values[i])
              label.innerText = values[i]
              this.alternativesDiv.appendChild(input)
              this.alternativesDiv.appendChild(label)
              this.alternativesDiv.appendChild(breakRow)
            }
          } else {
            this.answerInput.style.display = 'block'
            this.answerInput.value = ''
            this.sendAnswerBtn.style.display = 'block'
          }
        }).catch((err) => {
          console.error(`Ops! Something went wrong with the get request..\n${err}`)
        })
      } else if (this.mainBtn.shadowRoot.querySelector('.mainButton').id === 'gameReset') {
        window.location.reload()
      }
    }

    async _postAnswer (answer) {
      console.log(answer.id)
      await fetch(`${this._qURL}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({answer: answer.id})
      }).then((response) => {
        if (response.status === 500) {
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('question-and-answers').shadowRoot
            .querySelector('quiz-highscore')
            .setAttribute('gamefinished', 'true')
          this.shadowRoot.querySelector('.scoreboard').style.display = 'block'
          this.shadowRoot.querySelector('.q-head').style.display = 'none'
          this.shadowRoot.querySelector('.a-div').style.display = 'none'
          this.timeSlot.setAttribute('timesup', 'true')
        } else {
          return response.json()
        }
      }).then((obj) => {
        if (!obj.nextURL) {
          this.shadowRoot.querySelector('.ifCorrect').style.display = 'block'
          this.shadowRoot.querySelector('.ifCorrect').innerText = obj.message
          this.timeSlot.setAttribute('timesup', 'true')
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('question-and-answers').shadowRoot
            .querySelector('quiz-highscore')
            .setAttribute('gamestopped', 'true')
          setTimeout(() => {
            this.shadowRoot.querySelector('.scoreboard').style.display = 'block'
            this.shadowRoot.querySelector('.q-head').style.display = 'none'
            this.shadowRoot.querySelector('.a-div').style.display = 'none'
          }, 2000)
        } else {
          this.shadowRoot.querySelector('.ifCorrect').style.display = 'block'
          this.shadowRoot.querySelector('.ifCorrect').innerText = obj.message
          this._qURL = obj.nextURL
          this._getQuestion()
        }
      }).catch((err) => {
        console.error(`Ops! Something went wrong with the post request...\n${err}`)
      })
    }
  })
