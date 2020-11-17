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
</style>
<div class="q-div">
  <h2 class="q-head"></h2>
</div>
<div class="a-div">
  <h1 class="ifCorrect"></h1>
  <ul id="a-list">
    <li id="a-1">1</li>
    <li id="a-2">4</li>
    <li id="a-3">8</li>
    <li id="a-4">2</li>
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
  }

  connectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').addEventListener('click', this._getQuestion)
    this.alternativesList.addEventListener('click', event => {
      this._postAnswer(event)
    })
  }

  async _getQuestion() {
    this.shadowRoot.querySelector('#a-list').style.display = 'block'
    this.shadowRoot.querySelector('.ifCorrect').style.display = 'none'
    await fetch(`${this._qURL}`)
      .then((response) => {
        return response.json()
      }).then((obj) => {
        this.shadowRoot.querySelector('.q-head').innerText = obj.question
        this._qURL = obj.nextURL
        if (obj.alternatives) {
          const alternatives = Object.entries(obj.alternatives)
          // Continue here!!
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
      body: JSON.stringify({answer: answer.target.innerText})
    }).then((response) => {
      return response.json()
    }).then((obj) => {
      console.log(obj)
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
