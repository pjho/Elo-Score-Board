import firebase from 'firebase';

function fireBaseWrapper(conf) {

  firebase.initializeApp({
    apiKey: conf.apiKey,
    authDomain: `${conf.firebase}.firebaseapp.com`,
    databaseURL: `https://${conf.firebase}.firebaseio.com`,
    storageBucket: `firebase-${conf.firebase}.appspot.com`,
  });

  this.auth = firebase.auth();
  this.rootRef = firebase.database();
  this.history = this.rootRef.ref('history');
  this.players = this.rootRef.ref('players');

  this.updateResults = function(results) {
    this.players.update(results);
  };

  this.pushHistory = function(player, history) {
    this.history.child(player.id).push(history);
  };

  this.newPlayer = function(player, callback) {
    this.players.push(player, (error) => {
      callback(!error);
    });
  };

  this.getPlayers = function(callBack) {
    this.players.on('value', callBack);
  };


  /**
   * Fetches Game data for a given player
   * @param  {string}   playerId  The players Id
   * @param  {Int}      days      The number of days data to fetch
   * @param  {Function} cb        Callback function to run once data is fetched
   * @return {Object}             Firebase reference so it can be turned off when unmounting component.
   */
  this.playerDataForNumDays = function(playerId, days, cb) {
    const now = new Date();
    const timeNow = now.getTime();
    const then = new Date(now.setDate(now.getDate() - days));
    const timeThen = then.getTime();

    const playerHistory = this.history.child(playerId);

    playerHistory.orderByChild("dateTime")
      .startAt(timeThen)
      .endAt(timeNow)
      .on("value", function(data) {
        cb(data.val());
      }.bind(this));

    return playerHistory;
  };

  /**
   * Checks auth status of current user. Auth is async so needs to respond with a callback
   * @return {boolean} returns true if logged in
   */
  this.checkAuth = function checkAuth(cb) {
    this.auth.onAuthStateChanged((user) => {
      cb(user);
    });
  };


  /**
  * Async Auth with Firebase Logs user in to the system
  * @param  {Function} cb Callback to tell caller model when acync test is complete or errored.
  */
  this.doLogin = function(user, pass, cb) {
    const auth = this.auth;
    this.auth.signInWithEmailAndPassword(user, pass)
      .then( () => cb(true) )
      .catch( (error) => cb(false, error) );
  };

  /**
   * Ends a user session
   */
  this.doLogout = function() {
    this.auth.signOut();
    // .then(() => { /* Sign-out successful.*/ }, (error) => { /* An error happened. */ });
  };

  /**
   * Destroys firbase refs. Used on componentWillUnmount
   */
  this.unload = function() {
    this.players.off();
  };

  /**
   * Deletes a player from firebase
   * @param  {String} player The ID for the firebase player object
   */
  this.deletePlayer = function(player) {
    const ref = this.players.child(player);
    ref.remove(() => ref.off());
  };

  /**
   * Updates a player's information
   * @param  {String}   playerId The ID for the firebase player object
   * @param  {Object}   newData  An object with the key:value data to be updated on the player
   * @param  {Function} cb       The function to be called on complete.
   */
  this.updatePlayer = function(player, newData, cb) {
    const ref = this.players.child(player);
    ref.update(newData, () => {
      ref.off();
      cb();
    });
  };


}

module.exports = fireBaseWrapper;
