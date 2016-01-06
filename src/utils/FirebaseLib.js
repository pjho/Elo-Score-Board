import React from 'react';
import Firebase from 'firebase';

function fireBaseWrapper(firebaseRoot) {

  this.fbUrl = `https://${firebaseRoot}.firebaseio.com`;

  let fbHistoryPath = this.fbUrl + "/history";

  this.fbRootRef = new Firebase(this.fbUrl);
  this.fbPlayersRef = new Firebase( this.fbUrl + "/players" );

  this.updateResults = function(results){
    this.fbPlayersRef.update(results);
  };

  this.pushHistory = function(player, history){
    let playerHistoryUrl = [fbHistoryPath, player.id].join('/');
    let fbPlayerHistory = new Firebase(playerHistoryUrl);
    fbPlayerHistory.push(history);
  };

  this.newPlayer = function(player, callback){
    this.fbPlayersRef.push(player, (error) => {
      callback(!error);
    });
  };

  this.dataOn = function(eventType, callBack){
    this.fbPlayersRef.on(eventType, callBack);
  };

  /**
   * Retrieves Game data for a player for the current month
   * @param  {string}   playerId  The Firebase Id of the player
   * @param  {string}   eventType Firebase event type
   * @param  {function} callBack  The function to call when data is received
   * @return {object}             Returns the Firebase Ref object so we can close the connection on unMount
   */
  this.getEloDataForCurrentMonth = function(playerId, eventType, callBack) {
    let now = new Date();
    let date = [now.getFullYear(), now.getMonth()].join('_');
    let playerUrl = [this.fbUrl, 'history', playerId, date].join('/');
    let fbPlayerHistoryRef = new Firebase(playerUrl);

    fbPlayerHistoryRef.on(eventType, callBack);

    return fbPlayerHistoryRef;
  };


  /**
   * Fetches Game data for a given player
   * @param  {string}   playerId  The players Id
   * @param  {Int}      days      The number of days data to fetch
   * @param  {Function} cb        Callback function to run once data is fetched
   * @return {Object}             Firebase reference so it can be turned off when unmounting component.
   */
  this.playerDataForNumDays = function(playerId, days, cb) {
    let now = new Date();
    let timeNow = now.getTime();
    let then = new Date(now.setDate(now.getDate() - days));
    let timeThen = then.getTime();

    var fbRef = new Firebase(this.fbUrl + '/history/' + playerId);

    fbRef.orderByChild("dateTime")
      .startAt(timeThen)
      .endAt(timeNow)
      .on("value", function(data) {
        var games = this.bindAsArray(data);
        cb(games);
      }.bind(this));

    return fbRef;
  };


  /**
   * Binds a collection of firebase items to an array
   * @param  {Object} snapshot Raw firebase return object
   * @return {Array}           Firebase data processed into an array
   */
  this.bindAsArray = function(snapshot) {
    var arr = [];
    snapshot.forEach(function(item) {
      var obj = item.val();
      obj.id = item.key();
      arr.push(obj);
    });
    return arr;
  };


  /**
   * Checks auth status of current user.
   * @return {boolean} returns true if logged in
   */
  this.authed = function() {
    let authData = this.fbRootRef.getAuth();
    return !!authData;
  };

  /**
  * Async Auth with Firebase Logs user in to the system
  * @param  {Function} cb Callback to tell caller model when acync test is complete or errored.
  */
  this.doLogin = function(user, pass, cb) {

    this.fbRootRef.authWithPassword({
      email    : user,
      password : pass
    }, function(error, authData) {
      if (error) {
        cb(false, error);
      } else {
        cb(true);
      }
    });

  };

  /**
   * Ends a user session
   */
  this.doLogout = function() {
    this.fbRootRef.unauth();
  };

  /**
   * Destroys firbase refs. Used on componentWillUnmount
   */
  this.unload = function() {
    this.fbPlayersRef.off();
  };

  /**
   * Deletes a player from firebase
   * @param  {String} player The ID for the firebase player object
   */
  this.deletePlayer = function(player) {
    let fbPlayerRef = new Firebase( `${this.fbUrl}/players/${player}` );
    fbPlayerRef.remove(() => fbPlayerRef.off());
  };

  /**
   * Updates a player's information
   * @param  {String}   playerId The ID for the firebase player object
   * @param  {Object}   newData  An object with the key:value data to be updated on the player
   * @param  {Function} cb       The function to be called on complete.
   */
  this.updatePlayer = function(playerId, newData, cb) {
    let fbPlayerRef = new Firebase( `${this.fbUrl}/players/${playerId}` );
    fbPlayerRef.update(newData, () => {
      fbPlayerRef.off();
      cb();
    });
  };


}

module.exports = fireBaseWrapper;
