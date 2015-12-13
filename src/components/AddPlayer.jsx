import React from 'react';
import { History } from 'react-router';
import { Icon } from './common/icon';
import { PlayerForm } from './gametable/player-form';
import _ from 'lodash';

export const AddPlayer = React.createClass({
  mixins: [ History ],

  // getInitialState() {},

  componentWillMount() {
    this.firebase = this.props.firebase;
  },

  componentWillUnmount: function() {
  },

  render() {
    let { authed, leagues } = this.props;
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
              <PlayerForm submitCallback={this.addNewPlayer} method="add" leagues={leagues} />
            </div>
          : <p>Yo gotta login essay.</p>
        }

      </div>
      );
  },

  addNewPlayer(newPlayer) {
    this.firebase.newPlayer(newPlayer);
  },


});


