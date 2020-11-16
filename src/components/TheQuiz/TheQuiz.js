/**
 * The main application component.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */


const template = document.createElement('template')

template.innerHTML = `
<style>
  h1 {
    text-align:center;
  }
  .mainBoard {
    background:grey;
    height:85%;
    width:95%;
    padding:1rem;
    margin:1rem auto;
    display:flex;
    flex-direction:row;
    gap:1rem;
    border-radius:10px;
  }
  .firstBox {
    width:70%;
  }

  .secondBox {
    width:30%;
  }

  .playerName {
    position:absolute;
    top: 10px;
    left:20px;
  }

</style>
<h2 class="playerName"></h2>
<h1>The big quiz!</h1>
<div class="mainBoard">
  <div class="firstBox">
    <h1>firstBox</h1>
  </div>
  <div class="secondBox">
  <h1>TIME</h1>
  </div>
</div>
`

customElements.define('the-quiz-app', 
class TheQuiz extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
    this.playerName = this.promptPlayerName()
  }

  promptPlayerName () {
    if (!this.playerName) {
      this.playerName = prompt('Please enter a username: ', 'Santa Claus')
      this.shadowRoot.querySelector('.playerName').innerText = `${this.playerName} is playing!`
    }
  }
})