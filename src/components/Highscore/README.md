<h1 align="center">&lt;quiz-highscore&gt;</h1>
A web component that represents the quiz scoreboard.
<br>
<br>

## Attributes
<hr>
<strong>playername</strong><br>
A string attribute which, if gamefinished is true, saves the playername and the score to the local storage.
<br>
Default value: empty string


<strong>score</strong><br>
A number attribute which, if gamefinished is true, saves the playername and the score to the local storage.
<br>
Default value: 0

<strong>gamefinished</strong><br>
A Boolean attribute which, if true, adds the playername and score to local storage and renders the scoreboard.
<br>
Default value: undefined

<strong>gamestopped</strong><br>
A Boolean attribute which, if true, renders the scoreboard.
<br>
Default value: undefined
