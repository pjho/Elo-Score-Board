import React from 'react';
import { History, Link } from 'react-router';
import { Icon } from './common/icon';
import { PlayerForm } from './gametable/player-form';
import _ from 'lodash';

export const AddPlayer = React.createClass({
  mixins: [ History ],

  getInitialState() {
    return ({
      playerAdded: false,
      player: false,
      error: false
    });
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
  },

  componentWillUnmount: function() {
  },

  render() {
    let { authed, leagues } = this.props;
    let { player, playerAdded, error } = this.state;
    let league = this.props.params.leagueName;

    return (
      <div className="AddPlayer">
        <div className="UtilHeader">
          <button className="btn--util-left btn-sm btn btn-default" onClick={this.history.goBack}>
           <Icon type="remove" /> Cancel
          </button>
          <h4>Add New Player</h4>
        </div>
        { authed
          ? <div className="col-md-4 col-md-offset-4">

              { error &&
                <div className="alert bg-danger">
                  There was a problem adding the new player.
                </div>
              }

              { playerAdded &&
                <div className="alert border-success">
                  <img src={!!player.image ? player.image : '/img/avatar.jpg'} className="img-circle img-thumbnail" />
                  {player.name} has been added to <Link to={`/league/${player.league}`}>{player.league} league</Link>.
                </div>
              }

              <PlayerForm submitCallback={this.addNewPlayer} method="add" leagues={leagues} league={league} />
            </div>
          : <p>Yo gotta login essay.</p>
        }

      </div>
      );
  },

  addNewPlayer(newPlayer) {
    this.firebase.newPlayer(newPlayer, (success) => {
      let newState = success ? { playerAdded: true, player: newPlayer } : {error: true};
      this.setState(newState);
    });
  },


});


