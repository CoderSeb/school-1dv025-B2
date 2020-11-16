const template = document.createElement('template')

template.innerHTML = `
<style>
  .startButton {
    width:400px;
    height:100px;
    font-size:3em;
    margin:15rem 30%;
    border-radius:10px;
    border:none;
    background:yellow;
    color:blue;
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
})