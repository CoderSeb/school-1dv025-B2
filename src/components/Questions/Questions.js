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
    this.qURL = 'http://courselab.lnu.se/question/1'
    this.getQuestion = this.getQuestion.bind(this)
    this.postAnswer = this.postAnswer.bind(this)
  }

  connectedCallback() {
    document.querySelector('the-quiz-app').shadowRoot.querySelector('quiz-start-button').addEventListener('click', this.getQuestion)
    this.shadowRoot.querySelector('#a-list').addEventListener('click', event => {
      this.postAnswer(event)
    })
  }

  async getQuestion() {
    this.shadowRoot.querySelector('#a-list').style.display = 'block'
    this.shadowRoot.querySelector('.ifCorrect').style.display = 'none'
    await fetch(`${this.qURL}`)
      .then((response) => {
        return response.json()
      }).then((obj) => {
        this.shadowRoot.querySelector('.q-head').innerText = obj.question
        console.log(obj)
      }).catch((err) => {
        console.error(`Ops! Something went wrong..\n${err}`)
      })
    }

  async postAnswer(answer) {
    await fetch('http://courselab.lnu.se/answer/1', {
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
      this.qURL = obj.nextURL
      this.getQuestion()
    }).catch((err) => {
      console.error(`Ops! Something went wrong with the post request...\n${err}`)
    })
  }

})