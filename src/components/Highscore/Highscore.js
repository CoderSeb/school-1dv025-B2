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

      // Get the player nickname input and highscore div.
      this.playerName = document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameInput').value
      this.highscoreList = this.shadowRoot.querySelector('.highscoreList')

      // Creating score and player name variable.
      this.totalScore = 0
      this.playerSavedName = ''

      // Get the local storage.
      this.scoreStorage = window.localStorage

      // Binds methods.
      this._addToStorage = this._addToStorage.bind(this)
      this._renderScoreBoard = this._renderScoreBoard.bind(this)
    }

    /**
     * Attributes to monitor for change.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['playername', 'score', 'gamefinished', 'gamestopped']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'playername') {
        this.playerSavedName = newValue
      } else if (name === 'score') {
        if (isNaN(newValue)) {
          newValue = 0
        } else {
          this.totalScore += Number(newValue)
        }
      }
      if (name === 'gamefinished') {
        if (newValue === 'true') {
          this._addToStorage(this.playerSavedName, this.totalScore)
          this._renderScoreBoard()
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
          this._renderScoreBoard()
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

    /**
     * Takes name and score and add them to the local storage.
     *
     * @param {string} name - The player name.
     * @param {number} score - The player score.
     */
    _addToStorage (name, score) {
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

    /**
     * Sorts the list of players in local storage and prints the top 5 to the scoreboard.
     */
    _renderScoreBoard () {
      this.setAttribute('gamefinished', 'false')
      this.setAttribute('gamestopped', 'false')
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
