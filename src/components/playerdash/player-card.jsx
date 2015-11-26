import React from 'react';
import utils from '../../utils/utilities.js';
import { TableLine as CardLine } from './table-line';

export const PlayerCard = React.createClass({

  render() {
    const { name, image, league, score, topScore, wins, losses,
                id, bottomScore, streak, bestStreak, worstStreak} = this.props;

    return (
        <div className="panel panel-default">
          <table className="table">
            <thead>
              <tr>
                <th colSpan='2'>
                  <img src={image} className="img-circle img-thumbnail" />
                  {name}
                </th>
              </tr>
            </thead>
            <tbody>
              <CardLine title={league + ' League'}  />
              <CardLine title='Rating' value={score} />
              <CardLine title='Best Rating' value={topScore} />
              <CardLine title='Worst Rating' value={bottomScore} />
              <CardLine title='Current Streak' value={streak} />
              <CardLine title='Best Streak' value={bestStreak} />
              <CardLine title='Worse Streak' value={worstStreak} />
              <CardLine title='Losses' value={losses} />
              <CardLine title='Wins' value={wins} />
              <CardLine title='Percent' value={utils.percentOfPlayerWins(wins, losses)} />
            </tbody>
          </table>
      </div>
    );
  }
});
