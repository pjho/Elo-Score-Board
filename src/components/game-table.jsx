import React from 'react';
import ReactFire from 'reactfire';
import Firebase from 'firebase';
import Player from './player';
import AddPlayerForm from './player-form';
import Icon from './icon';
import conf from '../../app.config.json';
import _ from 'lodash';
import Elo from 'elo-rank';
import { Link } from 'react-router'


const EloRank = Elo(24);

module.exports = React.createClass({

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
          <th className="hide_sm">
            Rank
          </th>
          <th>
            Player
          </th>
          <th className="hide_sm">
            League
          </th>
          <th className="tc">
            Score
          </th>
          <th className="tc">
            Streak
          </th>
          <th className="tc">
            Wins
          </th>
          <th className="text-right action-buttons">
            {!!this.props.params.leagueName &&
              <Link to="/" className='btn btn-sm btn-default'>
                <Icon type="menu-left" /> All Leagues
              </Link>
            }
            <a className='btn btn-sm btn-default' onClick={this.toggleEditMode}>
              { this.state.editMode ? "done" : <Icon type="edit" /> }
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
      { this.state.editMode &&
        <tr className="warning">
          <td colSpan="7">
            <AddPlayerForm submitCallback={this.addNewPlayer} method="add" />
          </td>
        </tr>
      }
      { this.state.players.filter(this.playerLeagueFilter).map(this.playerComponentMap) }
      </tbody>
    </table>
    );
  },

  playerLeagueFilter(player) {
    return ! this.props.params.leagueName || player.league === this.props.params.leagueName;
  },

  playerComponentMap(player, index) {
    return <Player key={player.id} {...player} rank={index + 1} editMode={this.state.editMode}
            onPlay={this.handleGamePlay} currentGame={{winner: this.state.winner, loser: this.state.loser }} />
  },

  handleGamePlay(type, player) {
    let newState = {};
    newState[type] = player;
    this.setState(newState, this.processGame);
  },

  processGame() {
    // only do the stuff if we have a winner and a loser.
    if( ! this.state.winner || ! this.state.loser) { return; }

    let winner = _.find(this.state.players, (player) => player.id === this.state.winner);
    let loser = _.find(this.state.players, (player) => player.id === this.state.loser);
    let gameResult = this.scoreGame( winner.score, loser.score );
    let results = {};

    // Update Winner Statistics
    results[winner.id] = _.assign( _.omit(winner,'id'), {
      score: gameResult.winner,
      wins: winner.wins + 1,
      streak: ( winner.streak >= 0 ? winner.streak + 1 : 1) || 1,
      bestStreak: ( Math.max( winner.streak + 1,  winner.bestStreak) ) || 1,
      topScore: ( Math.max(gameResult.winner, winner.topScore) ) || gameResult.winner
    });

    // Update Loser Statistics
    results[loser.id] = _.assign( _.omit(loser,'id'), {
      score: gameResult.loser,
      losses: loser.losses + 1,
      streak: ( loser.streak <= 0 ? loser.streak - 1 : -1 ) || 0,
      worstStreak: ( Math.min(loser.streak - 1, loser.worstStreak) ) || -1,
      bottomScore: ( Math.min(gameResult.loser, loser.bottomScore ) ) || gameResult.loser
    });

    // Update Game Statistics
    let history = {
      dateTime: new Date().getTime(),
      winner: winner.id,
      winnerOldScore: winner.score,
      winnerNewScore: results[winner.id].score,
      loserNewScore: results[loser.id].score,
      loser: loser.id,
      loserOldScore: loser.score
    }

    if(winner.league != loser.league) {
      alert('Player\'s leagues do not match.');
    }

    else if(confirm("So you're saying " + winner.name + " beat " + loser.name + "?")) {
      this.fireBase.update(results);

      let winnerUrl = [conf.firebaseUrl, 'history', winner.id].join('/');
      let fireBaseWinnerHistory = new Firebase(winnerUrl);

      fireBaseWinnerHistory.push(history);

      let loserUrl = [conf.firebaseUrl, 'history', loser.id].join('/');
      let fireBaseLoserHistory = new Firebase(loserUrl);

      fireBaseLoserHistory.push(history);
    }

    this.setState({ winner: null, loser: null });

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
      loser: loser,
      winnerGain: (expectedScoreWinner - winner.score),
      loserLose: (loser.score - expectedScoreLoser),
    };
  }
});
