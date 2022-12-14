/**
 * The main application component.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import '../TheTime/TheTime.js'
import '../MainButton/MainButton.js'
import '../Questions/Questions.js'

/**
 * Define a template.
 */
const template = document.createElement('template')
template.innerHTML = `
<style>
  .titleHeader {
    height:60px;
    font-size: 3em;
    position:absolute;
    top:0px;
    left:50%;
    transform:translate(-50%);
  }
  .mainBoard {
    background:green;
    height:fit-content;
    width:95%;
    padding:1rem;
    margin:7rem auto 1em auto;
    display:flex;
    flex-direction:row;
    gap:1rem;
    border-radius:10px;
    box-shadow:0px 0px 5px 5px black;
  }
  .firstBox {
    width:70%;
    opacity:0.7;
  }

  .firstBox > h2, h4 {
    text-align:center;
  }

  .playerNameInput {
    font-size:1.2em;
    outline:none;
    border:none;
    background:lightgreen;
    position:absolute;
    top:0px;
    width: 250px;
    height:50px;
    padding:0.5em;
    border-radius: 0 0 5px 0;
  }

  .playerNameHeader {
    display:none;
    position:absolute;
    top: 10px;
    left:50px;
    font-size:2em;
  }

  @media only screen and (max-width:800px) {
    .mainBoard {
      flex-direction:column;
    }
  }

</style>
<h1 class="titleHeader">The big quiz!</h1>
<input type="text" class="playerNameInput" placeholder="Enter your nickname here!" />
<h2 class="playerNameHeader"></h2>

<div class="mainBoard">
  <div class="firstBox">
  <h2>Enter a nickname at the top to start the quiz!</h2>
  <h4><i>by doing so you agree to the use of local browser storage for storing your highscore.</i></h4>
  <question-and-answers></question-and-answers>
    <quiz-main-button></quiz-main-button>
  </div>
  <quiz-time></quiz-time>
</div>
`

/**
 * Define custom element.
 */
customElements.define('the-quiz-app',
  class TheQuiz extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))
    }

    /**
     * Called when the element is created.
     */
    connectedCallback () {
      this.shadowRoot.querySelector('quiz-main-button').shadowRoot
        .querySelector('.mainButton').style.display = 'none'
      this.shadowRoot.querySelector('.playerNameInput')
        .addEventListener('keyup', event => {
          this._getPlayerName(event)
        })
    }

    /**
     * Called when the element is removed.
     */
    disconnectedCallback () {
      this.shadowRoot.querySelector('.playerNameInput')
        .removeEventListener('keyup', event => {
          this._getPlayerName(event)
        })
    }

    /**
     * Attribute(s) to monitor for changes.
     *
     * @returns {string[]} A string array for attribute(s) to monitor.
     */
    static get observedAttributes () {
      return ['gamereset']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The name of the attribute.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'gamereset') {
        if (newValue === 'true') {
          this.shadowRoot.querySelector('.firstBox > h2').style.display = 'block'
          this.shadowRoot.querySelector('.firstBox > h4').style.display = 'block'
          this.shadowRoot.querySelector('question-and-answers')
            .setAttribute('gamereset', 'true')
        }
      }
    }

    /**
     * Gets the player name from the event and after a certain time (5s) the
     * name will show and the quiz start button will show.
     *
     * @param {object} event The input element which holds the player name.
     */
    _getPlayerName (event) {
      this.shadowRoot.querySelector('.playerNameHeader')
        .innerText = `${event.target.value} is playing!`
      document.querySelector('the-quiz-app').shadowRoot
        .querySelector('question-and-answers').shadowRoot
        .querySelector('quiz-highscore')
        .setAttribute('playername', event.target.value)
      setTimeout(() => {
        this.shadowRoot.querySelector('.firstBox > h2').style.display = 'none'
        this.shadowRoot.querySelector('.firstBox > h4').style.display = 'none'
        this.shadowRoot.querySelector('.playerNameHeader')
          .style.display = 'inline-block'
        this.shadowRoot.querySelector('.playerNameInput')
          .style.display = 'none'
        this.shadowRoot.querySelector('quiz-main-button').shadowRoot
          .querySelector('.mainButton').style.display = 'block'
        this.shadowRoot.querySelector('quiz-main-button').shadowRoot
          .querySelector('.mainButton').textContent = 'Start quiz!'
        this.shadowRoot.querySelector('quiz-main-button').shadowRoot
          .querySelector('.mainButton').id = 'gameStart'
      }, 5000)
    }
  })
