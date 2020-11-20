const template = document.createElement('template')
template.innerHTML = `
  <style>
    .highscore-container {
      min-width:30%;
      background:white;
      border-radius:8px;
      padding:1em;
      text-align:center;
    }
  </style>
  <div class="highscore-container">
    <h1>Quiz Highscore</h1>
  </div>
`
customElements.define('quiz-highscore',
  class Highscore extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({mode: 'open'})
      .appendChild(template.content.cloneNode(true))
    }


})