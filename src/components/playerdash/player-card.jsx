import React from 'react';
import _u from '../../utils/utilities.js';
import { TableLine as CardLine } from './table-line';
import { Avatar } from '../common/avatar';

export const PlayerCard = React.createClass({

  render() {
    const { name, image, league, score, topScore, wins, losses,
                id, bottomScore, streak, bestStreak, worstStreak} = this.props;

    return (
        <div className="PlayerCard panel panel-default">
          <table className="table">
            <thead>
              <tr>
                <th colSpan='2'>
                  <Avatar src={image} /> {name}
                </th>
              </tr>
            </thead>
            <tbody>
              <CardLine title='Rating' value={score} high={topScore} low={bottomScore} />
              <CardLine title='Streak' value={streak} high={bestStreak} low={worstStreak} />
              <CardLine title='Games' value={wins + losses} high={wins} low={losses} />
              <CardLine title='Win Percent' value={_u.percentOfPlayerWins(wins, losses)} />
            </tbody>
          </table>
      </div>
    );
  }
});
