import React from 'react';
import ReactFire from 'reactfire';
import Player from './gametable/player';
import PlayerCard from './playerdash/player-card';
import Icon from './common/icon';
import conf from '../../app.config.json';
import _ from 'lodash';
import { Link } from 'react-router';
import EloGraph from './playerdash/elo-graph';
import FirebaseLib from '../utils/FirebaseLib.js';

module.exports = React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      graphdata: [],
      loaded: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib();
    // We are likely to want to read all player data e.g. top adversary, last 10 matches etc
    // So leaving this here for now. Woould be nicer to have a store where this data is kept without requesting again
    this.loadData(); // should update to bindAsObject/Array
  },

  render() {
    // console.log(this.state.players);
    const player = _.find(this.state.players, p => p.id == this.props.params.playerId);
    const thedata = this.state.graphdata;

    return (
      <div className="Player">
      { player &&
        <div className="col-md-3">
        <PlayerCard {...player} />
        </div>
      }
      { !player &&
        "Player loading..."
      }
      { thedata &&
        <div className="col-md-9">
        <EloGraph graph={thedata} />
        </div>
      }
      { !thedata &&
        "Graph loading..."
      }
      </div>
      );
  },

  loadData() {
    this.firebase.dataOn('value', (rawItems) => {
      var items = [];
      var sorted = [];

      rawItems.forEach( (rawItem) => {
        var item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      this.setState({
        players: items,
        loaded: true
      });

    });

    this.firebase.getEloDateForCurrentMonth(this.props.params.playerId, 'value',(rawItems) => {
      var items = [];

      rawItems.forEach( (rawItem) => {
        var item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      var data = [];
      var getDataPoint = function getDataPoint(id, item){
        if(item.loser == id){
          return [item.dateTime, item.loserNewScore];
        }
        else if(item.winner == id){
          return [item.dateTime, item.winnerNewScore];
        }
      }



      items.forEach( (item) => {
        data.push(getDataPoint(this.props.params.playerId, item));
      });

      var shouldlooklike = [
        [1447219256248,1600],
        [1447219256249,1610],
        [1447219256250,1620],
        [1447219256251,1640],
        [1447219256252,1656],
        [1447219256253,1634],
        [1447219256254,1665]];

      this.setState({
        graphdata: data,
        loaded: true
      });
    });
  }

});


