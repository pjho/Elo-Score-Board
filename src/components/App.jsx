import React from 'react';
import ReactFire from 'reactfire';
import _ from 'lodash';
import { Link } from 'react-router'
import FirebaseLib from '../utils/FirebaseLib.js';


export const App =  React.createClass({

  mixins: [ ReactFire ],

  getInitialState() {
    return {
      players: [],
      loaded: false,
      authed: false
    }
  },

  componentWillMount() {
    this.firebase = new FirebaseLib();
    this.loadPlayerData();

    this.setState({
      authed: this.firebase.authed()
    })
  },

  render() {
    let {loaded, authed, players} = this.state;

    return (
      <div className={ `EloApp ${ !loaded ? 'loading' : '' }` }>
        {this.props.children && React.cloneElement(this.props.children, {
            authed: authed,
            players: players,
            doLogin: this.doLogin,
            doLogout: this.doLogout,
            firebase: this.firebase
          })}
      </div>
    );
  },

  loadPlayerData() {
    // this.bindAsArray(ref, "items");

    this.firebase.dataOn('value', (rawItems) => {
      var items = [];
      var sorted = [];

      rawItems.forEach( (rawItem) => {
        var item = rawItem.val();
        item.id = rawItem.key();
        items.push(item);
      });

      sorted = _.sortBy(items, (item) => {
        return -item.score;
      });

      this.setState({
        players: sorted,
        loaded: true
      });

    });
  },


  doLogout() {
    this.firebase.doLogout();
    this.setState({ authed: false });
  },

  doLogin() {
    let user = prompt('Enter your Username/Email address.');
    let pass = prompt('Enter your password');

    if(!user || !pass) { return; }

    this.firebase.doLogin( user, pass, function(authed, msg) {
      if (msg) { alert(msg); };
      this.setState({ authed: authed });
    }.bind(this) );
  }

});
