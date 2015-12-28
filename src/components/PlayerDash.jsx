import React from 'react';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { OpponentStats } from './playerdash/opponent-stats';
import { RecentGames } from './playerdash/recent-games';
import { History } from 'react-router';
import { Loader } from './common/loader';
import 'date-format-lite';


import _ from 'lodash';

export const PlayerDash = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      gameData: [],
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
    this.loadGameData(30);
  },

  componentWillUnmount: function() {
    // Close the connection to the player game data.
    this.state.fbGameDataRef && this.state.fbGameDataRef.off();
  },

  render() {
    let col3 = document.querySelector('.col-md-3');
    let col3w = col3 ? col3.offsetWidth : 0;
    let constrained = col3w < 334;

    let { players } = this.props;
    let { gameData } = this.state;
    let playerId = this.props.params.playerId;
    const player = this.playerById(playerId);

    return (
      <div className={"PlayerDash " + (constrained ? ' constrained' : 'yo momma')}>
        { !player || !gameData.length && <Loader /> }

        <div className="UtilHeader">
          <button className="btn--util-left btn btn-default btn-sm" onClick={this.history.goBack}>&larr; Back</button>
          { player &&
              <h4>{ `${ player.name } - ${ player.league } League` }</h4>
          }
        </div>

        <div className="col-md-3">
          { player ? <PlayerCard {...player} /> : <p>Loading Player Stats...</p> }

          <hr />

          <h5>Recent Games</h5>
          { gameData.length && player
            ? <RecentGames games={gameData} player={player} playerById={this.playerById} number="5" />
            : <p>Loading Games...</p>
          }
        </div>

        <div id="EloGraphWrapper" className="col-md-6">
          <h5 className="sep">Elo Graph</h5>
          { gameData.length
            ? <EloGraph graph={gameData} playerId={playerId} days={30} />
            : <p>Loading Graph...</p>
          }
        </div>

        <div className="col-md-3">
          <h5 className="sep">Opponents</h5>
         { gameData.length && player
            ? <OpponentStats games={gameData} player={player} playerById={this.playerById} />
            : <p>Loading Opponents...</p>
         }
        </div>

      </div>
      );
  },

  playerById(id) {
    return _.find(this.props.players, (p) => p.id == id);
  },

  loadGameData(days) {
    let player = this.props.params.playerId;
    let fbGameDataRef = this.firebase.playerDataForNumDays( player, days, (games) => {
      this.setState({
        gameData: _.sortBy(games, (g) => -g.dateTime),
        fbGameDataRef: fbGameDataRef,
      });
    });
  }

});
