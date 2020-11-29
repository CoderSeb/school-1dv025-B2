

const template = document.createElement('template')

template.innerHTML = `
<style>
  .mainButton {
    width:50%;
    min-width: 250px;
    height:100px;
    font-size:3em;
    margin-top:15rem;
    margin-left: 50%;
    transform:translate(-50%);
    display:block;
    border-radius:10px;
    border:none;
    background:yellow;
    color:blue;
    outline:none;
    box-shadow:0 0 5px 1px black;
    transition:all 0.2s ease;
  }

  .mainButton:hover {
    background:lightgreen;
    color:black;
    scale:1.1;
  }

  .mainButton:active {
    background:green;
    color:black;
  }

</style>
<button class="mainButton" id="gameStart" type="submit">Ready!</button>
`

customElements.define('quiz-main-button', 
  class MainButton extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({mode: 'open'})
        .appendChild(template.content.cloneNode(true))
        this._gameReset = this._gameReset.bind(this)
        this._gameStart = this._gameStart.bind(this)
    }

    connectedCallback() {
      this.shadowRoot.querySelector('.mainButton').addEventListener('click', () => {
        if (this.shadowRoot.querySelector('.mainButton').id === 'gameStart') {
          this._gameStart()
        } else if (this.shadowRoot.querySelector('.mainButton').id === 'gameReset') {
          this._gameReset()
        }
      })
    }

    disconnectedCallback() {
      this.shadowRoot.querySelector('.mainButton').removeEventListener('click', () => {
        if (this.shadowRoot.querySelector('.mainButton').id === 'gameStart') {
          this._gameStart()
        } else if (this.shadowRoot.querySelector('.mainButton').id === 'gameReset') {
          this._gameReset()
        }
      })
    }

    _gameStart() {
      setTimeout(() => {
        this.shadowRoot.querySelector('.mainButton').style.display = 'none'
      }, 100)
    }

    _gameReset() {
      console.log('game about to reset')
      setTimeout(() => {
        this.shadowRoot.querySelector('.mainButton').style.display = 'none'
        document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameInput').style.display = 'unset'
        document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameInput').value = ''
        document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameHeader').innerText = ''
        document.querySelector('the-quiz-app').shadowRoot.querySelector('.playerNameHeader').style.display = 'none'
        document.querySelector('the-quiz-app').shadowRoot.querySelector('question-and-answers').shadowRoot.querySelector('.scoreboard').style.display = 'none'
        document.querySelector('the-quiz-app').setAttribute('gameReset', 'true')
      }, 100)
    }
  })
