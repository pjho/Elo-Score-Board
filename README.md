Elo ScoreBoard
====
A simple scoreboard implementing the [Elo ranking system](https://en.wikipedia.org/wiki/Elo_rating_system) built with ReactJS & Firebase.

Demo: [elotest.firebaseapp.com](https://elotest.firebaseapp.com/) login: elo123

---

###Getting Started###

1. Clone this Repo
2. Create an account at [FireBase](https://www.firebase.com/) and create a new Firebase App
3. Copy `firebase.json.sample.txt` to `firebase.json`
4. Update the `firebase` setting to point to your new Firebase App's url.
5. `> npm install`  
6. `> npm run dev` || `npm run start` to develop  
7.  `> npm run build` to build a distribution with minfied files.

### FireBase ###
To setup serverside validation rules enter firebase.config.json rule set under the `Security & Rules` section of your Firebase dashboard.

### Authentication ###
The goal with authentication in this app is to prevent vandalism, not to have a robust feature rich auth & permissions model. It is reccomended that a single user account is created with a password that is shared between all players. The user details that a player logs in to the app with have no correlation with players on the board. User account management is handled entirely in the Firebase app UI.

To create an authenticated user account go to the `Login and Auth` section of your Firebase settings panel. Set your session length ideally to 12 months or more so players don't have to auth regularly. Under the `Email & Password` tab check the `Enable Email and Password Authentication` checkbox. Scroll to the bottom of the page and click the green `Add User` button.

In your `firebase.json` you can add a setting for `globalUser`. Doing so means the email address you enter for this value will be used for all auth  sessions and a user using the app will only need to know & only be prompted for the password to authenticate.

### Hosting ###
This app can be hosted anywhere, the only special requirement is that the server routes all requests to index.html. That said, Firebase has an excellent hosting service and since we are already using Firebase for our data storage it makes sense to host it there also. The additional settings in firebase.json are for this purpose.

**Hosting Instructions**  

Firebase Hosting docs can be [viewed here](https://firebase.google.com/docs/hosting/)  

1. `> npm install -g firebase-tools` to install firebase command line tools  
2. `> firebase login` to login to firebase in your terminal  
3. `> npm run build` to compile your application if you haven't done so already  
4. `> firebase deploy` and optionally `firebase deploy -m "you can add a deploy message like so"`  
5.  You can add profile pictures to `./img/avatars` which will be pushed to firebase but are ignored from git.  

---

### ToDo ###
* Improve Player & Game Stats View

