import React from 'react';
import _ from 'lodash';

export const OpponentStats = React.createClass({

  render() {
    const {games, player} = this.props;

    let gamesByPlayer = _.groupBy(games, (game) => player.id == game.loser ? game.winner : game.loser );
        gamesByPlayer = _.map( gamesByPlayer, this.mapGamesToOpponentStats);
        gamesByPlayer = _.sortBy( _.compact(gamesByPlayer), (i) => -i.games.count);

    return (
          <table className="OpponentStats table">
            <thead>
              <tr>
                <th width="34%">Opponent</th>
                <th width="33%" className="text-center">Games</th>
                <th width="33%" className="text-center">Points</th>
              </tr>
            </thead>
            <tbody>
            {  gamesByPlayer && gamesByPlayer.map( (opponent) => {
                 return (
                   <tr key={opponent.id}>
                     <td>
                        <img className="img-circle img-thumbnail" src={ opponent.details.image || '/img/avatar.jpg' } />
                        { opponent.details.name }
                     </td>

                     <td>
                       <div className="os_metricGroup">
                         <span className="os_fullMetric">
                           {opponent.games.count}
                         </span>
                         <div>
                           <span className="os_splitMetric">
                             <img className="img-circle img-thumbnail img-tiny" src={ opponent.details.image || '/img/avatar.jpg' } title={opponent.details.name} />
                             <span className="os_splitMetric_value">{opponent.games.wins}</span>
                           </span>
                           <span className="os_splitMetric">
                             <img className="img-circle img-thumbnail img-tiny" src={ player.image || '/img/avatar.jpg' } title={player.name} />
                             <span className="os_splitMetric_value">{opponent.games.losses}</span>
                           </span>
                         </div>
                       </div>
                    </td>

                    <td>
                      <div className="os_metricGroup">
                        <span className="os_fullMetric">
                          {opponent.games.pointsLost - opponent.games.pointsWon}
                        </span>
                        <div>
                          <span className="os_splitMetric">
                            <img className="img-circle img-thumbnail img-tiny" src={ opponent.details.image || '/img/avatar.jpg' } title={opponent.details.name} />
                            <span className="os_splitMetric_value">{opponent.games.pointsWon}</span>
                          </span>
                          <span className="os_splitMetric">
                            <img className="img-circle img-thumbnail img-tiny" src={ player.image || '/img/avatar.jpg' } title={player.name} />
                            <span className="os_splitMetric_value">{opponent.games.pointsLost}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                   </tr>
                 )}
               )
            }
            </tbody>
          </table>
    );
  },

  mapGamesToOpponentStats(games, opponent) {
    let opponentInfo = this.props.playerById(opponent);
    if (!opponentInfo) { return null; }

    let emptyStats = { count: 0, wins: 0, losses: 0, pointsWon: 0, pointsLost: 0 }
    let gameStats = games.reduce( function(total, current) {
      let {winner, loserNewScore, loserOldScore, winnerNewScore, winnerOldScore} = current;
      let opponentIsWinner = opponent == current.winner;
      return {
        count: total.count + 1,
        wins: total.wins + (opponentIsWinner ? 1 : 0),
        losses: total.losses + (opponentIsWinner ? 0 : 1),
        pointsWon: total.pointsWon + (opponentIsWinner ? (winnerNewScore - winnerOldScore) : 0),
        pointsLost: total.pointsLost + (!opponentIsWinner ? (loserOldScore - loserNewScore) : 0),
      }
    }, emptyStats );

    return { id: opponent, details: opponentInfo, games: gameStats };
  }

});
