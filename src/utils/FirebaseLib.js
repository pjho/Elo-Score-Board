import React from 'react';
import Firebase from 'firebase';
import conf from '../../app.config.json';

function fireBaseWrapper(){
  let fbPlayersPath = [conf.firebaseUrl, 'players'].join('/');
  let fbHistoryPath = [conf.firebaseUrl, 'history'].join('/');

  this.fbRootRef = new Firebase(conf.firebaseUrl);
  this.fbPlayersRef = new Firebase(fbPlayersPath);

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

  this.getEloDataForCurrentMonth = function(playerId, eventType, callBack){
    let now = new Date();
    let date = [now.getFullYear(), now.getMonth()].join('_');

    let playerUrl = [conf.firebaseUrl, 'history', playerId, date].join('/');
    let fireBasePlayerHistory = new Firebase(playerUrl);
    fireBasePlayerHistory.on(eventType, callBack);
  };

  /**
   * Checks auth status of current user.
   * @return {boolean} returns true if logged in
   */
  this.authed = function() {
    let authData = this.fbRootRef.getAuth();
    // console.log(authData);
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
