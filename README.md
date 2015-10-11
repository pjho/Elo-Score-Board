Elo ScoreBoard
====
A simple scoreboard implementing the [Elo ranking system](https://en.wikipedia.org/wiki/Elo_rating_system) built with ReactJS & Firebase.

---

###Getting Started###

1. Clone this Repo
2. Create an account at [FireBase](https://www.firebase.com/) and create a new Firebase App
3. Copy `app.config.json.sample.txt` to `app.config.json`
4. Update the `firebaseUrl` setting to point to your new Firebase App's url.
5. > `npm install`
6. > `gulp`

### FireBase ###
To setup serverside validation rules enter the following JSON rule set under the `Security & Rules` section of your Firebase dashboard.

```json

{
  "rules": {
    ".write": false,
    ".read": false,

    "players": {
      ".read": true,
      ".write": true,

      "$playersId": {
        ".validate": "newData.hasChildren(['name', 'image', 'league', 'score', 'wins', 'losses'])",
        "$other": { ".validate": false },
        "name":   { ".validate": "newData.isString() && newData.val().length > 1 && newData.val().length < 100" },
        "image":  { ".validate": "newData.isString() && newData.val().matches(/^https?:\\/\\/.+\\.(png|jpg|jpeg|gif)$/i) && newData.val().length < 300" },
        "league": { ".validate": "newData.isString() && newData.val().length > 1 && newData.val().length < 100" },
        "score":  { ".validate": "newData.isNumber()" },
        "wins":   { ".validate": "newData.isNumber()" },
        "losses": { ".validate": "newData.isNumber()" }
      }
    }
  }
}

```

---

### ToDo ###
* Basic authentication
* Player Details
