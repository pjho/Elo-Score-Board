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
    let now = new Date();
    let date = [now.getFullYear(), now.getMonth()].join('_');
    let playerHistoryUrl = [fbHistoryPath, player.id, date].join('/');
    let fbPlayerHistory = new Firebase(playerHistoryUrl);
    fbPlayerHistory.push(history);
  };

  this.newPlayer = function(player){
    this.fbPlayersRef.push(player);
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
}

module.exports = fireBaseWrapper;
