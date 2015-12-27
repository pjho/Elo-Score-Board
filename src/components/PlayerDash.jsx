import React from 'react';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { OpponentStats } from './playerdash/opponent-stats';
import { History } from 'react-router';
import { Loader } from './common/loader';

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
    this.loadGameData(50);
  },

  componentWillUnmount: function() {
    // Close the connection to the player game data.
    this.state.fbGameDataRef && this.state.fbGameDataRef.off();
  },

  render() {
    let { players } = this.props;
    let { gameData } = this.state;
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
        { gameData && player
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
        gameData: games,
        fbGameDataRef: fbGameDataRef,
      });
    });
  }

});
