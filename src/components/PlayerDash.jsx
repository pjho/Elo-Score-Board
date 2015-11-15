import React from 'react';
import ReactFire from 'reactfire';
import Firebase from 'firebase';
import Player from './gametable/player';
import PlayerCard from './playerdash/player-card';
import Icon from './common/icon';
import conf from '../../app.config.json';
import _ from 'lodash';
import { Link } from 'react-router';
import EloGraph from './playerdash/elo-graph';

module.exports = React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      loaded: false
    }
  },

  componentWillMount() {
    // We are likely to want to read all player data e.g. top adversary, last 10 matches etc
    // So leaving this here for now. Woould be nicer to have a store where this data is kept without requesting again
    let fbPath = [conf.firebaseUrl, 'players'].join('/');
    this.fireBase = new Firebase(fbPath);
    this.loadData(); // should update to bindAsObject/Array
  },

  render() {
    // console.log(this.state.players);
    const player = _.find(this.state.players, p => p.id == this.props.params.playerId);
    return (
      <div className="Player">
      { player &&
        <div>
          <div className="col-md-3">
            <PlayerCard {...player} />
          </div>
          <div className="col-md-9">
            <EloGraph {...player} />
          </div>
        </div>
      }
      { !player &&
          "Player not found."
      }
      </div>
    );
  },

  loadData() {
    this.fireBase.on('value', (rawItems) => {
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
  }

});
