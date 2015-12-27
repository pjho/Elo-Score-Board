import React from 'react';
import { Avatar } from '../common/avatar';
import _ from 'lodash';

export const RecentGames = React.createClass({

  render() {
    const {games, player, playerById, number} = this.props;
    let playerId = player.id;

     return (
      <div className="RecentGames">
        <ul>
        { _.compact(games.map( (game, i) => {
            let playerWon = game.winner == playerId;
            let opponent = playerId == game.winner ? playerById(game.loser) : playerById(game.winner);

            let winnerGain = game.winnerNewScore - game.winnerOldScore;
            let loserLoss = game.loserNewScore - game.loserOldScore;

            return player && opponent ? (
              <li key={i} className="rg_game">
                <p className="rg_date">
                  <span>{ new Date(game.dateTime).format("MMM DD - HH.mmA") }</span>
                  { i == 9999990 &&
                    <a href="#">remove</a>
                  }
                </p>

                <div className="rg_gameStats">
                  <span>
                    <Avatar src={player.image} className="img-tiny" /> {player.name}
                    {(playerWon ? ' beat ' : ' lost to ')}
                    { opponent.name } <Avatar src={opponent.image} className="img-tiny" />
                  </span>

                  <span>
                    { playerWon ? winnerGain : loserLoss}
                    <span className="seperator"> | </span>
                    { playerWon ? loserLoss : winnerGain }
                  </span>

                </div>
              </li>
            ) : null
          })).slice(0, number)
        }
        </ul>
      </div>
    );
  },

});
