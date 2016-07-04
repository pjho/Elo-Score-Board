import React from 'react';
import { Player } from './gametable/player';
import { PlayerForm } from './gametable/player-form';
import { Icon } from './common/icon';

import _assign from 'lodash.assign';
import _omit from 'lodash.omit';
import _find from 'lodash.find';

import Elo from 'elo-rank';
import { Link } from 'react-router'

export const GameTable =  React.createClass({

  getInitialState() {
    return {
      winner: null,
      loser: null
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
  },

  render() {
    let {params, authed, players, leagues} = this.props;
    let {winner, loser} = this.state;

    let isEditMode = authed && window.location.href.indexOf('edit') > -1;
    let currentPath = window.location.pathname.replace(/\/$/, "");

    players = players.filter(this.playerLeagueFilter);

    return (
      <div>
        <div className="UtilHeader">
          { isEditMode &&
            <Link to={ currentPath.slice(0, -5) || '/' } className="btn--util-left btn-sm btn btn-default">
              <Icon type="remove" /> Done Editing
            </Link>
          }
          { !isEditMode && this.props.params.leagueName &&
            <Link to="/" className="btn--util-left hide_sm btn-sm btn btn-default">
               &larr; All Leagues
            </Link>
          }
          <h4>
            { params.leagueName ? params.leagueName + " League" : "All Leagues" }
          </h4>
        </div>

        <table className={"elo-ranking-table table"}>
          <thead>
            <tr>
              <th className="hide_sm">Rank</th>
              <th>Player</th>
              <th className="hide_sm">League</th>
              <th className="tc">Score</th>
              <th className="tc">Streak</th>
              <th className="tc">Wins</th>
              { authed && <th></th> }
            </tr>
          </thead>
          <tbody>
            { players.map( (player,index) => {
                  return <Player {...player}
                           key={player.id}
                           rank={index + 1}
                           editMode={isEditMode}
                           onPlay={this.handleGamePlay}
                           currentGame={{winner: winner, loser: loser }}
                           authed={authed}
                           firebase={this.firebase}
                           leagues={leagues}
                         />
                })
            }
          </tbody>
        </table>
      </div>
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

    if( ! this.props.authed ) {
      alert("You need to be logged in to perform this action.");
      return;
    }

    let winner = _find(this.props.players, (player) => player.id === this.state.winner);
    let loser = _find(this.props.players, (player) => player.id === this.state.loser);

    if(winner.league != loser.league) {
      alert('Player\'s leagues do not match.');

    } else { // this guy checks out, process the game.

      let gameResult = this.scoreGame( winner.score, loser.score );
      let results = {};
      let now = new Date().getTime();

      // Update Winner Statistics
      results[winner.id] = _assign( _omit(winner,'id'), {
        score: gameResult.winner,
        wins: winner.wins + 1,
        streak: ( winner.streak >= 0 ? winner.streak + 1 : 1) || 1,
        bestStreak: ( Math.max( winner.streak + 1,  winner.bestStreak) ) || 1,
        topScore: ( Math.max(gameResult.winner, winner.topScore) ) || gameResult.winner,
        lastPlayed: now
      });

      // Update Loser Statistics
      results[loser.id] = _assign( _omit(loser,'id'), {
        score: gameResult.loser,
        losses: loser.losses + 1,
        streak: ( loser.streak <= 0 ? loser.streak - 1 : -1 ) || 0,
        worstStreak: ( Math.min(loser.streak - 1, loser.worstStreak) ) || -1,
        bottomScore: ( Math.min(gameResult.loser, loser.bottomScore ) ) || gameResult.loser,
        lastPlayed: now
      });

      // Update Game Statistics
      let history = {
        dateTime: now,
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

  scoreGame(winnerScore, loserScore) {
    winnerScore = parseInt(winnerScore);
    loserScore = parseInt(loserScore);
    const EloRank = Elo(24);

    let expectedScoreWinner = EloRank.getExpected(winnerScore, loserScore);
    let expectedScoreLoser = EloRank.getExpected(loserScore, winnerScore);

    return {
      winner: EloRank.updateRating(expectedScoreWinner, 1, winnerScore),
      loser: EloRank.updateRating(expectedScoreLoser, 0, loserScore)
    };
  }

});
