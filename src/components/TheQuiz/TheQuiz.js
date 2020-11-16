/**
 * The main application component.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */


const template = document.createElement('template')

template.innerHTML = `
<h1>This works..</h1>

`

customElements.define('the-quiz-app', 
class TheQuiz extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({mode: 'open'})
    .appendChild(template.content.cloneNode(true))
  }
})