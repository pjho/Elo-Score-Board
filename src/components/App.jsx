import React from 'react';
import ReactFire from 'reactfire';
import _ from 'lodash';
import { Link } from 'react-router'
import FirebaseLib from '../utils/FirebaseLib.js';
import { Icon } from './common/icon';

import { Menu } from './app/menu';

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
      authed: this.firebase.authed(),
      menuOpen: false
    })
  },

  render() {
    let {loaded, authed, players, menuOpen} = this.state;

    let isEditMode = window.location.href.indexOf('edit') > -1;
    let currentPath = window.location.pathname.replace(/\/$/, "");
    let hasLeague = !!this.props.params.leagueName;


    return (
      <div className={ `${ !loaded ? 'loading' : '' }` }>

        <Menu menuState={menuOpen} toggleMenu={this.toggleMenu}>
          <Link to={ '/' }><Icon type="home" /> Home</Link>
          <hr />
          { authed
            && (isEditMode
              ? <Link to={ currentPath.slice(0, -5) || '/' } ><Icon type="edit" /> Finished Editing</Link>
              : <Link to={ currentPath + '/edit' }><Icon type="edit" /> Edit Players</Link>
            )
          }
          { authed &&
              <Link to={ currentPath + '/edit' }><Icon type="user" /> Add Player</Link>
          }
          { authed && <hr /> }
          <Link className='menu-item' to="/">All Leagues</Link>
          <Link className='menu-item' to="/league/Agile">&raquo;&nbsp; Agile</Link>
          <Link className='menu-item' to="/league/API">&raquo;&nbsp;  Api</Link>
          <hr />
          { authed
            ? <a onClick={this.doLogout}>Logout</a>
            : <a onClick={this.doLogin}>Login</a>
          }
        </Menu>

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
  },

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

});
