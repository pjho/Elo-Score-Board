import React from 'react';
import { PlayerCard } from './playerdash/player-card';
import { EloGraph } from './playerdash/elo-graph';
import { History } from 'react-router';
import conf from '../../app.config.json';
import _ from 'lodash';

export const PlayerDash = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return {
      graphData: []
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
        <div className="UtilHeader">
          <button className="btn--util-left btn btn-default btn-sm" onClick={this.history.goBack}>&larr; Back</button>
          { player &&
              <h4>{ `${ player.name } - ${ player.league } League` }</h4>
          }
        </div>

        { player &&
          <div className="PlayerCard col-md-3">
            <PlayerCard {...player} />
          </div>
        }
        { !player &&
          "Player loading..."
        }
        { graphData &&
          <div className="EloGraph col-md-9">
            <EloGraph graph={graphData} playerId={this.props.params.playerId}/>
          </div>
        }
        { !graphData &&
          "Graph loading..."
        }
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


