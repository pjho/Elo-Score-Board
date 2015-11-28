import React from 'react';
import ReactFire from 'reactfire';
import Firebase from 'firebase';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { History } from 'react-router';
import conf from '../../app.config.json';
import _ from 'lodash';
import FirebaseLib from '../utils/FirebaseLib.js';

export const PlayerDash = React.createClass({
  mixins: [ ReactFire, History ],

  getInitialState() {
    return {
      players: [],
      graphData: [],
      loaded: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib();
    this.loadGraphData();
    this.loadPlayersData();
  },

  componentWillUnmount: function() {
    this.firebase.unload();
  },

  render() {
    let { players, graphData } = this.state;

    const player = _.find(players, p => p.id == this.props.params.playerId);

    return (
      <div className="Player">
        <div className="UtilHeader">
          <button className="back btn btn-default" onClick={this.history.goBack}>&larr; Back</button>
        </div>

        { player &&
          <div className="PlayerCard col-md-3">
            <PlayerCard {...player} />
          </div>
        }
        { !player &&
          "Player loading..."
        }
        { graphData &&
          <div className="EloGraph col-md-9">
            <EloGraph graph={graphData} playerId={this.props.params.playerId}/>
          </div>
        }
        { !graphData &&
          "Graph loading..."
        }
      </div>
      );
  },

  loadPlayersData(){
    this.firebase.dataOn('value', (rawItems) => {
      let items = [];
      let sorted = [];

      rawItems.forEach( (rawItem) => {
        let item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      this.setState({
        players: items,
        loaded: true
      });

    });
  },

  loadGraphData(){
    this.firebase.getEloDataForCurrentMonth(this.props.params.playerId, 'value',(rawItems) => {

      this.setState({
        graphData: rawItems,
        loaded: true
      });
    });
  }

});


