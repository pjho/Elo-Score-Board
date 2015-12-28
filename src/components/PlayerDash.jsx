import React from 'react';
import { Link } from 'react-router';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { OpponentStats } from './playerdash/opponent-stats';
import { RecentGames } from './playerdash/recent-games';
import { Loader } from './common/loader';
import 'date-format-lite';

import _ from 'lodash';

export const PlayerDash = React.createClass({

  getInitialState() {
    return {
      gameData: [],
      days: this.props.params.days || 30,
      fetching: true
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
    this.loadGameData(this.props.params.playerId, this.state.days);
  },

  componentWillReceiveProps(newProps) {
    let {days: newDays, playerId: newPlayerId} = newProps.params;
    let {days, playerId} = this.props.params;

    if( days != newDays || playerId != newPlayerId ) {
      this.setState({
        days: newDays || 30,
        gameData: [],
        fetching: true
      });

      this.state.fbGameDataRef.off();
      this.loadGameData(newPlayerId, newDays);
    }
  },

  componentWillUnmount: function() {
    // Close the connection to the player game data.
    this.state.fbGameDataRef && this.state.fbGameDataRef.off();
  },

  render() {

    let col3 = document.querySelector('.col-md-3');
    let col3w = col3 ? col3.offsetWidth : 0;
    let constrained = col3w < 334;

    let { players, params } = this.props;
    let { gameData, days, fetching } = this.state;
    let playerId = params.playerId;

    const player = this.playerById(playerId);

    return (
      <div className={"PlayerDash " + (constrained ? ' constrained' : 'yo momma')}>
        { fetching && <Loader /> }

        <div className="UtilHeader">
          <Link to={`/league/${params.league}`} className="btn--util-left btn btn-default btn-sm">
            &larr; Back <span className="hide_sm">to league</span>
          </Link>
          { player &&
              <h4>{ `${ player.name } - ${ player.league } League` }</h4>
          }
        </div>

        <div className="col-md-3">
          { player
            ? <PlayerCard {...player}  days={days} />
            : <p>{ fetching ? 'Loading Player Stats...' : 'Player not found.'} </p>
          }
          <hr />
          <h5>Recent Games</h5>
          { gameData.length && player
            ? <RecentGames games={gameData} player={player} playerById={this.playerById} number="5" />
            : <p>{ fetching ? 'Loading Graph...' : 'No games found.'} </p>
          }
        </div>

        <div id="EloGraphWrapper" className="col-md-6">
          <h5 className="sep">Elo Graph</h5>
          { gameData.length
            ? <EloGraph graph={gameData} playerId={playerId} days={days} />
            : <p>{ fetching ? 'Loading Games...' : 'No games found.'} </p>
          }
        </div>

        <div className="col-md-3">
          <h5 className="sep">Opponents</h5>
         { gameData.length && player
            ? <OpponentStats games={gameData} player={player} playerById={this.playerById} days={params.days} />
            : <p>{ fetching ? 'Loading Opponents...' : 'No games found.'} </p>
         }
        </div>

      </div>
      );
  },

  playerById(id) {
    return _.find(this.props.players, (p) => p.id == id);
  },

  loadGameData(playerId, days=30) {
    let fbGameDataRef = this.firebase.playerDataForNumDays( playerId, days, (games) => {
      this.setState({
        fetching: false,
        gameData: _.sortBy(games, (g) => -g.dateTime),
        fbGameDataRef: fbGameDataRef,
      });
    });
  }

});
