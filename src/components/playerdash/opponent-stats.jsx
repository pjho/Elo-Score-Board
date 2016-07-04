import React from 'react';
import { Link } from 'react-router';
import { Avatar } from '../common/avatar'

import _groupBy from 'lodash.groupby';
import _map from 'lodash.map';
import _sortBy from 'lodash.sortby';
import _compact from 'lodash.compact';

export const OpponentStats = React.createClass({

  render() {
    const {games, player, days} = this.props;
    let gamesByPlayer = _groupBy(games, (game) => player.id == game.loser ? game.winner : game.loser );
        gamesByPlayer = _map( gamesByPlayer, this.mapGamesToOpponentStats);
        gamesByPlayer = _sortBy( _compact(gamesByPlayer), (i) => -i.games.count);

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
                        <Link to={`/league/${opponent.details.league}/player/${opponent.id}` + (days ? `/days/${days}` : '') }>
                          <Avatar src={ opponent.details.image } />
                          { opponent.details.name }
                        </Link>
                     </td>

                     <td>
                       <div className="os_metricGroup">
                         <span className="os_fullMetric">
                           {opponent.games.count}
                         </span>
                         <div>
                           <span className="os_splitMetric">
                             <Avatar className="img-tiny" src={ opponent.details.image } title={opponent.details.name} />
                             <span className="os_splitMetric_value">{opponent.games.wins}</span>
                           </span>
                           <span className="os_splitMetric">
                             <Avatar className="img-tiny" src={ player.image } title={player.name} />
                             <span className="os_splitMetric_value">{opponent.games.losses}</span>
                           </span>
                         </div>
                       </div>
                    </td>

                    <td>
                      <div className="os_metricGroup">
                        <span className="os_fullMetric">
                          {opponent.games.pointsGiven - opponent.games.pointsTaken}
                        </span>
                        <div>
                          <span className="os_splitMetric">
                            <Avatar className="img-tiny" src={ opponent.details.image } title={opponent.details.name} />
                            <span className="os_splitMetric_value">{opponent.games.pointsTaken}</span>
                          </span>
                          <span className="os_splitMetric">
                            <Avatar className="img-tiny" src={ player.image } title={player.name} />
                            <span className="os_splitMetric_value">{opponent.games.pointsGiven}</span>
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

    let emptyStats = { count: 0, wins: 0, losses: 0, pointsTaken: 0, pointsGiven: 0 }
    let gameStats = games.reduce( function(total, current) {


      let {winner, loserNewScore, loserOldScore, winnerNewScore, winnerOldScore} = current;
      let opponentIsWinner = opponent == current.winner;
      let winnerGain = winnerNewScore - winnerOldScore;
      let loserLoss = loserOldScore - loserNewScore;

      return {
        count: total.count + 1,
        wins: total.wins + (opponentIsWinner ? 1 : 0),
        losses: total.losses + (opponentIsWinner ? 0 : 1),
        pointsTaken: total.pointsTaken + (opponentIsWinner ? loserLoss : 0),
        pointsGiven: total.pointsGiven + (!opponentIsWinner ? winnerGain : 0),
      }
    }, emptyStats );

    return { id: opponent, details: opponentInfo, games: gameStats };
  }

});
