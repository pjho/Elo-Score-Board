import React from 'react';
import _u from '../../utils/utilities.js';
import { TableLine as CardLine } from './table-line';
import { Avatar } from '../common/avatar';
import { Link } from 'react-router'
import 'date-format-lite';

import _time from 'vague-time';

export const PlayerCard = React.createClass({

  render() {
    const { name, image, league, score, topScore, wins, losses,
                id, bottomScore, streak, bestStreak, worstStreak, days, lastPlayed } = this.props;

    let rootPath = window.location.pathname.replace(/\/(?:days\/[0-9]*)?\/?$/,'');

    return (
        <div className="PlayerCard panel panel-default">
          <table className="table">
            <thead>
              <tr>
                <th colSpan="2">
                  <div className="flex flex-between">
                    <div>
                      <Avatar src={image} /> {name}
                    </div>
                    <div className="dayLinks">
                      <small>Days:</small>
                      { [3, 7, 14, 30, 90, 365].map( (item) => {
                          return (
                            <Link key={item} to={[ rootPath, 'days', item].join('/')} className={item == days && 'active' }>
                              {item}
                            </Link>
                          )
                      })}
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <CardLine title='Rating' value={score} high={topScore} low={bottomScore} />
              <CardLine title='Streak' value={streak} high={bestStreak} low={worstStreak} />
              <CardLine title='Games' value={wins + losses} high={wins} low={losses} />
              <CardLine title='Win Percent' value={_u.percentOfPlayerWins(wins, losses)} />
              { lastPlayed &&
                  <CardLine title='Last Game' value={ _time.get({ to: lastPlayed }) } className='last-played' />
              }
            </tbody>
          </table>
      </div>
    );
  }
});
