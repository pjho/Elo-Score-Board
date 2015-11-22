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

      var getDataPoint = function getDataPoint(id, item){
        var utcToDate = function utcToDate(utc){
          return new Date(utc);
        }

        if(item.loser == id){
          return [utcToDate(item.dateTime), item.loserNewScore, 'Winner: ' + item.winner];
        }
        else if(item.winner == id){
          return [utcToDate(item.dateTime), item.winnerNewScore, 'Loser: ' + item.loser];
        }
      }

      var data = [];

      items.forEach( (item) => {
        data.push(getDataPoint(this.props.params.playerId, item));
      });

      this.setState({
        graphdata: data,
        loaded: true
      });
    });
  }
});


