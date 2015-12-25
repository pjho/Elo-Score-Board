import React from 'react';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { History } from 'react-router';
import { Loader } from './common/loader';

import _ from 'lodash';

export const PlayerDash = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      gameData: [],
      gamesByPlayer: []
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
    this.loadGameData(50);
  },

  componentWillUnmount: function() {
    // Close the connection to the player game data.
    this.state.fbGameDataRef && this.state.fbGameDataRef.off();
  },

  render() {
    // console.log(this.state);
    let { players } = this.props;
    let { gameData, gamesByPlayer } = this.state;

    console.log(gamesByPlayer);

    const player = this.playerById(this.props.params.playerId);

    return (
      <div className="Player">
        { !player || !gameData && <Loader /> }

        <div className="UtilHeader">
          <button className="btn--util-left btn btn-default btn-sm" onClick={this.history.goBack}>&larr; Back</button>
          { player &&
              <h4>{ `${ player.name } - ${ player.league } League` }</h4>
          }
        </div>

        <div className="PlayerCard col-md-3">
          { !!player ? <PlayerCard {...player} /> : <p>Loading Player Stats...</p> }
        </div>

        <div className="EloGraph col-md-6">
          { !!gameData
            ? <EloGraph graph={gameData} playerId={this.props.params.playerId}/>
            : <p>Loading Player Graph...</p>
          }
        </div>

        <div className="col-md-3">
        <h4>Contenders</h4>
          <table className="table">
            <thead>
              <tr>
                <th>Contender</th>
                <th className="rangeDisplay">
                  <sup>+</sup>
                  <span>Games</span>
                  <sub>-</sub>
                </th>
                <th className="rangeDisplay">
                  <sup>+</sup>
                  <span>Points</span>
                  <sub>-</sub>
                </th>
              </tr>
            </thead>
            <tbody>
            {  gamesByPlayer && gamesByPlayer.map( (p) => {
                 return (
                   <tr key={p.id}>
                     <td>
                        <img className="img-circle img-thumbnail" src={ p.details.image || '/img/avatar.jpg' } />
                        { p.details.name }
                     </td>
                     <td className="rangeDisplay">
                       <sup>{p.games.wins}</sup>
                       <span className="displayVal">{p.games.count}</span>
                       <sub>{p.games.losses}</sub>
                    </td>
                    <td className="rangeDisplay">
                      <sup>{p.games.pointsLost}</sup>
                      <span className="displayVal">{p.games.pointsWon - p.games.pointsLost}</span>
                      <sub>{p.games.pointsWon}</sub>
                    </td>
                   </tr>
                 )}
               )
            }
            </tbody>
          </table>
        </div>
      </div>
      );
  },


leagueStuff() {
  // let {players, params} = this.props;
  // let leaguePlayers  = _.filter(players, (player) => params.league == player.league );
  // let games = this.state.gameData;
  // console.log(params);
  // console.log(leaguePlayers);
  // console.log(this.playerById('-K07ieIIQMhgINgM_20a'));

  // let gameStuff = _.groupBy(games, (g) => g.loser == params.playerId ? g.winner : g.loser);

  // console.log(games);
  // console.log(gameStuff);
},


  playerById(id) {
    return _.find(this.props.players, (p) => p.id == id);
  },



  loadGameData(days) {
    let player = this.props.params.playerId;
    let fbGameDataRef = this.firebase.playerDataForNumDays( player, days, (games) => {
      this.setState({
        gameData: games,
        fbGameDataRef: fbGameDataRef,
        gamesByPlayer: _.compact( _.map( _.groupBy(games, (game) => game.loser == player ? game.winner : game.loser), (games, contender) => {
          let contenderInfo = this.playerById(contender);
          return contenderInfo
            ? { id: contender,
                details: contenderInfo,
                games: games.reduce( (total, current) => {
                  let {winner, loserNewScore, loserOldScore, winnerNewScore, winnerOldScore} = current;
                  let contenderIsWinner = contender == current.winner;

                // let logString = contenderIsWinner
                //   ? "Contender won " + (winnerNewScore - winnerOldScore) + " points. " + winnerNewScore + ' - ' + winnerOldScore
                //   : "Contender lost " + (loserOldScore - loserNewScore) + " points. " + loserNewScore + ' - ' + loserOldScore;
                // console.log(logString);



                  return {
                    count: total.count + 1,
                    wins: total.wins + (contenderIsWinner ? 1 : 0),
                    losses: total.losses + (contenderIsWinner ? 0 : 1),
                    pointsWon: total.pointsWon + (contenderIsWinner ? (winnerNewScore - winnerOldScore) : 0),
                    pointsLost: total.pointsLost + (!contenderIsWinner ? (loserOldScore - loserNewScore) : 0),
                  }
                }, { count: 0, wins: 0, losses: 0, pointsWon: 0, pointsLost: 0 })
              }
            : null;
        })),
      });
    });
  },


});
