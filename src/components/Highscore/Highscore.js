/**
 * The quiz-highscore web component module.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

/**
 * Define template.
 */
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
    <div class="highscoreDiv">
    <ol class="highscoreList"></ol>
    </div>
  </div>
`

/**
 * Define custom element.
 */
customElements.define('quiz-highscore',
  class Highscore extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the player nickname input, define score 
      this.playerName = document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameInput').value

      // Get the local storage.
      this.scoreStorage = window.localStorage

      // Bind methods
      this.addToStorage = this.addToStorage.bind(this)
      this.renderScoreBoard = this.renderScoreBoard.bind(this)


      this.totalScore = 0
      this.playerSavedName = ''
      this.highscoreList = this.shadowRoot.querySelector('.highscoreList')
    }

    static get observedAttributes () {
      return ['playername', 'score', 'gamefinished', 'gamestopped']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'playername') {
        this.playerSavedName = newValue
      } else if (name === 'score') {
        if (isNaN(newValue)) {
          newValue = 0
          this.totalScore += newValue
        } else {
          this.totalScore += Number(newValue)
        }
      }
      if (name === 'gamefinished') {
        if (newValue === 'true') {
          this.addToStorage(this.playerSavedName, this.totalScore)
          this.renderScoreBoard()
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').style.display = 'block'
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').id = 'gameReset'
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').textContent = 'Reset the game?'
          this.totalScore = 0
        }
      }
      if (name === 'gamestopped') {
        if (newValue === 'true') {
          this.renderScoreBoard()
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').style.display = 'block'
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').id = 'gameReset'
          document.querySelector('the-quiz-app').shadowRoot
            .querySelector('quiz-main-button').shadowRoot
            .querySelector('.mainButton').textContent = 'Reset the game?'
          this.totalScore = 0
        }
      }
    }

    addToStorage (name, score) {
      const player = {
        pName: name,
        pScore: score
      }
      const players = (() => {
        const playersArray = this.scoreStorage.getItem('players')
        return playersArray === null ? [] : JSON.parse(playersArray)
      })()

      players.push(player)
      this.scoreStorage.setItem('players', JSON.stringify(players))
    }

    renderScoreBoard () {
      this.setAttribute('gamefinished', 'false')
      this.setAttribute('gamstopped', 'false')
      let players = this.scoreStorage.getItem('players')
      players = JSON.parse(players)
      if (players !== null) {
        players.sort((a, b) => a.pScore - b.pScore)
        this.highscoreList.innerHTML = ''
        for (let i = 0; i < players.length; i++) {
          if (i < 5) {
            const listItem = document.createElement('li')
            listItem.textContent = `${players[i].pName} -- ${players[i].pScore}`
            this.highscoreList.appendChild(listItem)
          }
        }
      }
    }
  })
