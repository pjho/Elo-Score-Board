import React from 'react';
import { Icon } from '../common/icon';
import { Link } from 'react-router';

export const Menu =  React.createClass({

  render() {
    let { authed, leagues, doLogin, doLogout, open,
          toggleMenu, leagueName, rootComponent, _url } = this.props;

    let isEditMode = authed && _url.edit;
    let currentPath = window.location.pathname.replace(/\/$/, "");

    return (
      <div id="AppMenuWrapper" className={`AppMenuWrapper AppMenuWrapper--${ open ? "open" : "closed" }`}>

        <a className="AppMenuTrigger AppMenuTrigger--open" onClick={toggleMenu}>
          <Icon type="menu-hamburger" />
        </a>

        <div className="AppMenu">
          <a className="AppMenuTrigger AppMenuTrigger--close" onClick={toggleMenu}>
            <Icon type="remove" />
          </a>
          <ul>
            <li className="AppMenu__item" onClick={toggleMenu}>
              <Link to={ '/' }><Icon type="home" /> Home</Link>
            </li>

            <li className="AppMenu__item" onClick={toggleMenu}>
              <hr />
            </li>

            { authed && ["AddPlayer", "PlayerDash"].indexOf(rootComponent) == -1  &&
              <li className="AppMenu__item" onClick={toggleMenu}>
                { isEditMode
                  ? <Link to={ _url.without('edit') } ><Icon type="edit" /> Finished Editing</Link>
                  : <Link to={ _url.with('edit') }><Icon type="edit" /> Edit Players</Link>
                }
              </li>
            }

            { authed &&
              <li className="AppMenu__item" onClick={toggleMenu}>
                <Link to={ !!leagueName ? `/league/${leagueName}/add`  : '/add' }><Icon type="user" /> Add Player</Link>
              </li>
            }

            { authed && <li className="AppMenu__item" onClick={toggleMenu}><hr /></li> }

            <li className="AppMenu__item" onClick={toggleMenu}>
              <Link className='menu-item' to="/">All Leagues</Link>
            </li>

            { leagues &&
              leagues.map( (league, i) => { return (
                <li key={i} className="AppMenu__item" onClick={toggleMenu}>
                  <Link className='menu-item' to={`/league/${league}`}>
                    &raquo;&nbsp; {league}
                  </Link>
                </li>
              )})
            }

            <li className="AppMenu__item" onClick={toggleMenu}><hr /></li>

            <li className="AppMenu__item" onClick={toggleMenu}>
              { authed
                ? <a onClick={doLogout}>Logout</a>
                : <a onClick={doLogin}>Login</a>
              }
            </li>

          </ul>
        </div>
      </div>
    );
  },



});
