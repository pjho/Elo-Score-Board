import React from 'react';
import ReactFire from 'reactfire';
import { Player } from './gametable/player';
import { PlayerForm } from './gametable/player-form';
import { Icon } from './common/icon';
import _ from 'lodash';
import Elo from 'elo-rank';
import { Link } from 'react-router'
import FirebaseLib from '../utils/FirebaseLib.js';


export const GameTable =  React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      loaded: false,
      winner: null,
      loser: null,
      authed: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib();
    this.loadData();

    this.setState({
      authed: this.firebase.authed()
    })

  },

  componentWillUnmount: function() {
    this.firebase.unload();
  },

  render() {
    let isEditMode = window.location.href.indexOf('edit') > -1;
    let {params} = this.props;
    let {authed, players, loaded, winner, loser} = this.state;
    let currentPath = window.location.pathname.replace(/\/$/, "");

    players = players.filter(this.playerLeagueFilter);

    return (
    <table className={"elo-ranking-table table table-striped " + ( loaded ? "loaded" : "") }>
      <thead>
        <tr>
          <th className="hide_sm">Rank</th>
          <th>Player</th>
          <th className="hide_sm">League</th>
          <th className="tc">Score</th>
          <th className="tc">Streak</th>
          <th className="tc">Wins</th>
          <th className="text-right action-buttons">
            {!!params.leagueName &&
              <Link to="/" className='btn btn-sm btn-default'>
                <Icon type="menu-left" /> All Leagues
              </Link>
            }
            { authed
              && (isEditMode
                ? <Link to={ currentPath.slice(0, -5) || '/' } className='btn btn-sm btn-default'>done</Link>
                : <Link to={ currentPath + '/edit' } className='btn btn-sm btn-default'><Icon type="edit" /></Link>
              )
            }
            { authed
              ? <a className='btn btn-sm btn-default' onClick={this.doLogout}>logout</a>
              : <a className='btn btn-sm btn-default' onClick={this.doLogin}>login</a>
            }
          </th>
        </tr>
      </thead>
      <tbody>

        { authed && isEditMode &&
          <tr className="warning">
            <td colSpan="7">
              <PlayerForm submitCallback={this.addNewPlayer} method="add" />
            </td>
          </tr>
        }
        { players.map( (player,index) => {
              return <Player {...player} key={player.id} rank={index + 1} editMode={isEditMode}
                             onPlay={this.handleGamePlay} currentGame={{winner: winner, loser: loser }}
                             authed={authed} />
            })
        }

      </tbody>
    </table>
    );
  },

  playerLeagueFilter(player) {
    return ! this.props.params.leagueName || player.league === this.props.params.leagueName;
  },

  handleGamePlay(type, player) {
    let newState = {};
    newState[type] = player;
    this.setState(newState, this.processGame);
  },

  processGame() {
    // only do the stuff if we have a winner and a loser.
    if( ! this.state.winner || ! this.state.loser ) { return; }

    if( ! this.state.authed ) {
      alert("You need to be logged in to perform this action.");
      return;
    }

    let winner = _.find(this.state.players, (player) => player.id === this.state.winner);
    let loser = _.find(this.state.players, (player) => player.id === this.state.loser);

    if(winner.league != loser.league) {
      alert('Player\'s leagues do not match.');

    } else { // this guy checks out, process the game.

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

      if(confirm("So you're saying " + winner.name + " beat " + loser.name + "?")) {
        this.firebase.updateResults(results);
        this.firebase.pushHistory(winner, history);
        this.firebase.pushHistory(loser, history);
      }
    } // Ends Else

    this.setState({ winner: null, loser: null });

  },

  addNewPlayer(newPlayer) {
    this.firebase.newPlayer(newPlayer);
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

    const EloRank = Elo(24);

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
  },


  doLogout() {
    this.firebase.doLogout();
    this.setState({ authed: false });
  },

  doLogin() {
    let user = prompt('Enter your Username/Email address.');
    let pass = prompt('Enter your password');

    if(!user || !pass) { return; }

    this.firebase.doLogin( user, pass, function(authed, msg) {
      if (msg) { alert(msg); };
      this.setState({ authed: authed });
    }.bind(this) );
  }

});
