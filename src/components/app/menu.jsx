import React from 'react';
import { Icon } from '../common/icon';
import { Link } from 'react-router';

export const Menu =  React.createClass({

  getInitialState() {
    return {
      open: false
    }
  },

  render() {
    let { authed, leagues, doLogin, doLogout } = this.props;
    let { open } = this.state;

    let toggleMenu = this.toggleMenu;
    let isEditMode = authed && window.location.href.indexOf('edit') > -1;
    let currentPath = window.location.pathname.replace(/\/$/, "");

    return (
      <div id="AppMenuWrapper" className={`AppMenuWrapper AppMenuWrapper--${ open ? "open" : "closed" }`}>

        { isEditMode &&
          <Link to={ currentPath.slice(0, -5) || '/' } className="closeEditBtn btn btn-default btn-sm">
            <Icon type="remove" /> Done Editing
          </Link>
        }

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

            { authed &&
              <li className="AppMenu__item" onClick={toggleMenu}>
                { isEditMode
                  ? <Link to={ currentPath.slice(0, -5) || '/' } ><Icon type="edit" /> Finished Editing</Link>
                  : <Link to={ currentPath + '/edit' }><Icon type="edit" /> Edit Players</Link>
                }
              </li>
            }

            { authed &&
              <li className="AppMenu__item" onClick={toggleMenu}>
                <Link to={ '/player/add' }><Icon type="user" /> Add Player</Link>
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

  toggleMenu() {
    // document.body.classList.toggle("scroll-lock");
    this.setState({
      open: !this.state.open
    });
  }

});
