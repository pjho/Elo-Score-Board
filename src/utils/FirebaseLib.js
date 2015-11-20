import React from 'react';
import Firebase from 'firebase';
import conf from '../../app.config.json';

function fireBaseWrapper(){
  let fbPath = [conf.firebaseUrl, 'players'].join('/');
  let fbPathHistory = [conf.firebaseUrl, 'history'].join('/');
  this.fireBaseHistory = new Firebase(fbPathHistory);
  this.fireBase = new Firebase(fbPath);

  this.updateResults = function(results){
    this.fireBase.update(results);
  };

  this.pushHistory = function(player, history){
    let date = [new Date().getFullYear(), new Date().getMonth()].join('_');

    let playerUrl = [conf.firebaseUrl, 'history', player.id, date].join('/');
    let fireBasePlayerHistory = new Firebase(playerUrl);
    fireBasePlayerHistory.push(history);
  };

  this.newPlayer = function(player){
    this.fireBase.push(player);
  };

  this.dataOn = function(eventType, callBack){
    this.fireBase.on(eventType, callBack);
  };

  this.getEloDateForCurrentMonth = function(playerId, eventType, callBack){
    let date = [new Date().getFullYear(), new Date().getMonth()].join('_');

    let playerUrl = [conf.firebaseUrl, 'history', playerId, date].join('/');
    // alert(playerUrl);
    let fireBasePlayerHistory = new Firebase(playerUrl);
    fireBasePlayerHistory.on(eventType, callBack);
  };
}

module.exports = fireBaseWrapper;