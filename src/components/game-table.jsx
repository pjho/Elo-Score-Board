import React from 'react';

import ReactFire from 'reactfire';
import Firebase from 'firebase';
import Player from './components/player';
import AddPlayerForm from './components/player-form';
import conf from '../app.config.json';
import _ from 'lodash';
import Elo from 'elo-rank';

const EloRank = Elo(24);

var App = React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      editMode: false,
      loaded: false,
      winner: null,
      loser: null,
    }
  },

  componentWillMount() {
    // https://www.firebase.com/docs/web/libraries/react/api.html
    let fbPath = [conf.firebaseUrl, 'players'].join('/');
    this.fireBase = new Firebase(fbPath);
    this.loadData(); // should update to bindAsObject/Array
  },

  render() {
    return (
    <table className={"elo-ranking-table table table-striped " + ( this.state.loaded ? "loaded" : "") }>
      <thead>
        <tr>
          <th className="hide_sm">Rank</th>
          <th>Player</th>
          <th className="hide_sm">League</th>
          <th>Score</th>
          <th className="text-right">
            <a href="#" className='btn btn-sm btn-default' onClick={this.toggleEditMode}>
              { this.state.editMode ? "done" : "edit" }
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
      { this.state.editMode &&
        <tr className="warning">
          <td colSpan="5">
            <AddPlayerForm submitCallback={this.addNewPlayer} method="add" />
          </td>
        </tr>
      }
      {
        this.state.players.map( (player, index) =>
          <Player key={player.id}
                  {...player}
                  rank={index + 1}
                  editMode={this.state.editMode}
                  onPlay={this.handleGamePlay}
                  currentGame={{winner: this.state.winner, loser: this.state.loser }} />
        )
      }
      </tbody>
    </table>
    );
  },

  handleGamePlay(type, player) {
    let newState = {};
    newState[type] = player;
    this.setState(newState, this.processGame);
  },

  processGame() {

    // only do the stuff if we have a winner and a loser.
    if(this.state.winner && this.state.loser) {
      let winner = _.find(this.state.players, (player) => player.id === this.state.winner);
      let loser = _.find(this.state.players, (player) => player.id === this.state.loser);
      let gameResult = this.scoreGame( winner.score, loser.score );
      let results = {};
      let verbs = ["beat","blitzed","smashed","totally annihilated","destroyed"];

      results[winner.id] = _.assign( _.omit(winner,'id'), {
        score: gameResult.winner,
        wins: 1 + winner.wins
      });

      results[loser.id] = _.assign( _.omit(loser,'id'), {
        score: gameResult.loser,
        losses: 1 + loser.losses
      });

      if(confirm("So you're saying " + winner.name + " " + verbs[_.random(0, verbs.length - 1)] + " " + loser.name + "?")) {
        this.fireBase.update(results);
      }
      this.setState({ winner: null, loser: null });
    }

  },

  toggleEditMode(e) {
    e.preventDefault();
    this.setState({
      editMode: ! this.state.editMode
    });
  },

  addNewPlayer(newPlayer) {
    this.fireBase.push(newPlayer);
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

      sorted = _.sortBy(items, (item) => {
        return -item.score;
      });

      this.setState({
        players: sorted,
        loaded: true
      });

    });
  },

  scoreGame(winner, loser) {
    winner = parseInt(winner);
    loser = parseInt(loser);

    let expectedScoreWinner = EloRank.getExpected(winner, loser);
    let expectedScoreLoser = EloRank.getExpected(loser, winner);

    winner = EloRank.updateRating(expectedScoreWinner, 1, winner);
    loser = EloRank.updateRating(expectedScoreLoser, 0, loser);

    return {
      winner: winner,
      loser: loser
    };
  }
});
