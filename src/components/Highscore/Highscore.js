const template = document.createElement('template')
template.innerHTML = `
  <style>
    .highscoreContainer {
      min-width:30%;
      background:white;
      border-radius:8px;
      padding:1em;
      text-align:center;
    }
  </style>
  <div class="highscoreContainer">
    <h1>Quiz Highscore</h1>
  </div>
`
customElements.define('quiz-highscore',
  class Highscore extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({mode: 'open'})
      .appendChild(template.content.cloneNode(true))
      this.playerName = document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameInput').value
      this.scoreStorage = window.localStorage
      this.addToStorage = this.addToStorage.bind(this)
    }

    addToStorage (name, score) {
      this.scoreStorage.setItem(player = {
        playerName: name,
        score: score
      })
      this.scoreStorage.setItem
      console.log(`${this.scoreStorage.player} was added!`)
    }
})