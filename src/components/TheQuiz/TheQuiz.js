/**
 * The main application component.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import '../TheTime/TheTime.js'
import '../StartButton/StartButton.js'
import '../Questions/Questions.js'

const template = document.createElement('template')

template.innerHTML = `
<style>
  .titleHeader {
    width:300px;
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
  <question-and-answers></question-and-answers>
    <quiz-start-button></quiz-start-button>
  </div>
  <quiz-time></quiz-time>
</div>
`

customElements.define('the-quiz-app', 
class TheQuiz extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.playerNameInput').addEventListener('keyup', event => {
      this._getPlayerName(event)})
  }

  _getPlayerName (event) {
    this.shadowRoot.querySelector('.playerNameHeader').innerText = `${event.target.value} is playing!`
    setTimeout(() => {
      this.shadowRoot.querySelector('.playerNameHeader').style.display = 'inline-block'
      this.shadowRoot.querySelector('.playerNameInput').style.display = 'none'
    }, 5000)
  }
})