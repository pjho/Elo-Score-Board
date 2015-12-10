import React from 'react';
import ReactFire from 'reactfire';
import FirebaseLib from '../utils/FirebaseLib.js';
import _ from 'lodash';
import { Icon } from './common/icon';

import conf from '../../app.config.json';

import { Menu } from './app/menu';


export const App =  React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      leagues: [],
      loaded: false,
      authed: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib();
    this.loadPlayerData();

    this.setState({
      authed: this.firebase.authed(),
    })
  },

  render() {
    let {loaded, authed, players, menuOpen, leagues} = this.state;

    window._ = _;
    window.players = players;

    return (
      <div className={ `AppWrapper ${ !loaded ? 'loading' : '' }` }>

        <Menu authed={authed}
          leagues={leagues}
          doLogin={this.doLogin}
          doLogout={this.doLogout}
        />

        <div id="EloApp" className={`EloApp container-fluid ${ menuOpen  && "menu-open"}`}>
          {this.props.children && React.cloneElement(this.props.children, {
              authed: authed,
              players: players,
              doLogin: this.doLogin,
              doLogout: this.doLogout,
              firebase: this.firebase
            })}
        </div>
      </div>
    );
  },

  loadPlayerData() {
    // this.bindAsArray(ref, "items");

    this.firebase.dataOn('value', (rawItems) => {
      let items = [];
      let sorted = [];

      rawItems.forEach( (rawItem) => {
        var item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      sorted = _.sortBy(items, (item) => {
        return -item.score;
      });

      let leagues = _.uniq( _.pluck( sorted, 'league') );

      this.setState({
        players: sorted,
        leagues: leagues,
        loaded: true
      });

    });
  },


  doLogout() {
    this.firebase.doLogout();
    this.setState({ authed: false });
  },

  doLogin() {
    let user = conf.globalUser || prompt('Enter your Username/Email address.');
    let pass = prompt('Enter your password');

    if(!user || !pass) { return; }

    this.firebase.doLogin( user, pass, function(authed, msg) {
      if (msg) { alert(msg); };
      this.setState({ authed: authed });
    }.bind(this) );
  }
});
