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
      graphData: false
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
    this.loadGraphData();
  },

  componentWillUnmount: function() {
    // Close the connection to the player game data.
    this.state.fbDataRef && this.state.fbDataRef.off();
  },

  render() {
    let { players } = this.props;
    let { graphData } = this.state;

    const player = _.find(players, p => p.id == this.props.params.playerId);

    return (
      <div className="Player">

        { !player || !graphData && <Loader /> }

        <div className="UtilHeader">
          <button className="btn--util-left btn btn-default btn-sm" onClick={this.history.goBack}>&larr; Back</button>
          { player &&
              <h4>{ `${ player.name } - ${ player.league } League` }</h4>
          }
        </div>

        <div className="PlayerCard col-md-3">
          { !!player ? <PlayerCard {...player} /> : <p>Loading Player Stats...</p> }
        </div>

        <div className="EloGraph col-md-9">
          { !!graphData
            ? <EloGraph graph={graphData} playerId={this.props.params.playerId}/>
            : <p>Loading Player Graph...</p>
          }
        </div>
      </div>
      );
  },

  loadGraphData(){
    let fbDataRef = this.firebase.getEloDataForCurrentMonth(this.props.params.playerId, 'value', (rawItems) => {
      this.setState({
        graphData: rawItems,
        fbDataRef: fbDataRef
      });
    });
  }

});


