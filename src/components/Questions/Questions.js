import '../TheTime/TheTime.js'

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
    margin-top:1em;
    font-size:1.2em;
    border:none;
    border-radius:5px;
    padding:0.5em;
  }

  #inputSendBtn:hover {
    background:lightgreen;
  }

</style>
<div class="q-div">
  <h2 class="q-head" timelimit="20"></h2>
</div>
<div class="a-div">
  <h1 class="ifCorrect"></h1>
  <input class="q-input" maxlength="15" type="text"/>
  <button id="inputSendBtn">Send answer</button>
  <ul id="a-list">
  </ul>
</div>
`

customElements.define('question-and-answers',
class Question extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
    this._qURL = 'http://courselab.lnu.se/question/1'
    this._getQuestion = this._getQuestion.bind(this)
    this._postAnswer = this._postAnswer.bind(this)
    this.alternativesList = this.shadowRoot.querySelector('#a-list')
    this.answerInput = this.shadowRoot.querySelector('.q-input')
    this.sendAnswerBtn = this.shadowRoot.querySelector('#inputSendBtn')
    this.timeSlot = document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-time')
  }

  connectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').addEventListener('click', this._getQuestion)
    this.alternativesList.addEventListener('click', event => {
      this._postAnswer(event.target)
      this.alternativesList.style.display = 'none'
    })
    this.answerInput.addEventListener('keyup', () => {
      this.answerInput.id = this.answerInput.value
    })
    this.sendAnswerBtn.addEventListener('click', () => {
      this._postAnswer(this.answerInput)
      setTimeout(() => {
        this.answerInput.style.display = 'none'
        this.sendAnswerBtn.style.display = 'none'
      }, 1000)
    })
  }

  disconnectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').removeEventListener('click', this._getQuestion)
    this.alternativesList.removeEventListener('click', event => {
      this._postAnswer(event.target)
      this.alternativesList.style.display = 'none'
    })
    this.answerInput.removeEventListener('keyup', () => {
      this.answerInput.id = this.answerInput.value
    })
    this.sendAnswerBtn.removeEventListener('click', () => {
      this._postAnswer(this.answerInput)
      setTimeout(() => {
        this.answerInput.style.display = 'none'
        this.sendAnswerBtn.style.display = 'none'
      }, 1000)
    })
  }

  async _getQuestion() {
    this.shadowRoot.querySelector('.ifCorrect').style.display = 'none'
    await fetch(`${this._qURL}`)
      .then((response) => {
        return response.json()
      }).then((obj) => {
        this.shadowRoot.querySelector('.q-head').innerText = obj.question
        this._qURL = obj.nextURL
        if (obj.limit) {
          this.timeSlot.setAttribute('timelimit', obj.limit)
        } else if (!obj.limit) {
          this.timeSlot.setAttribute('timelimit', 20)
        }
        if (obj.alternatives) {
          this.alternativesList.style.display = 'block'
          const alternatives = obj.alternatives
          this.alternativesList.innerHTML = ``
          const values = Object.values(alternatives)
          const keys = Object.keys(alternatives)
          for (let i = 0; i < keys.length; i++) {
            const alt = document.createElement('li')
            alt.id = keys[i]
            alt.className = 'answerListItem'
            alt.innerText = values[i]
            this.alternativesList.appendChild(alt)
          }
        } else {
          this.answerInput.style.display = 'block'
          this.answerInput.value = ''
          this.sendAnswerBtn.style.display = 'block'
        }
      }).catch((err) => {
        console.error(`Ops! Something went wrong..\n${err}`)
      })
    }

  async _postAnswer(answer) {
    await fetch(`${this._qURL}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({answer: answer.id})
    }).then((response) => {
      return response.json()
    }).then((obj) => {
      this.shadowRoot.querySelector('.ifCorrect').style.display = 'block'
      this.shadowRoot.querySelector('.ifCorrect').innerText = obj.message
      setTimeout(() => {
        this._qURL = obj.nextURL
        this._getQuestion()
      }, 2000)
    }).catch((err) => {
      console.error(`Ops! Something went wrong with the post request...\n${err}`)
    })
  }
})
