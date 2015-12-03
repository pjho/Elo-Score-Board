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
6. > `npm run dev` || `npm run start` to develop
6b > `npm run build` to build a distribution with minfied files.


### FireBase ###
To setup serverside validation rules enter firebase.config.json rule set under the `Security & Rules` section of your Firebase dashboard.

### Authentication ###
The goal with authentication in this app is to prevent vandalism, not to have a robust feature rich auth & permissions model. It is reccomended that a single user account is created with a password that is shared between all players. The user details that a player logs in to the app with have no correlation with players on the board. User account management is handled entirely in the Firebase app UI.

To create an authenticated user account go to the `Login and Auth` section of your Firebase settings panel. Set your session length ideally to 12 months or more so players don't have to auth regularly. Under the `Email & Password` tab check the `Enable Email and Password Authentication` checkbox. Scroll to the bottom of the page and click the green `Add User` button. Enter your user & Bob's your uncle.


---

### ToDo ###
* Basic Authentication
* Player Details View
* Improve Player Stats
* Game Stats View
* UI to change league in mobile view
