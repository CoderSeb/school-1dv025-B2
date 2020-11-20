

const template = document.createElement('template')

template.innerHTML = `
<style>
  .startButton {
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

  .startButton:hover {
    background:lightgreen;
    color:black;
    scale:1.1;
  }

  .startButton:active {
    background:green;
    color:black;
  }

</style>
<button class="startButton" type="submit">Ready!</button>
`

customElements.define('quiz-start-button', 
class StartButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
  }

  connectedCallback() {
    this.addEventListener('click', () => {
      this._gameStart()
    })
  }

  disconnectedCallback() {
    this.removeEventListener('click', () => {
      this._gameStart()
    })
  }

  _gameStart() {
    setTimeout(() => {
      this.style.display = 'none'
    }, 100)
  }
})
