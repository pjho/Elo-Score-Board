import React from 'react';
import { Icon } from '../common/icon';

export const Menu =  React.createClass({

  render() {
    let {menuState: open, toggleMenu} = this.props;

    document.body.classList.toggle("menu-open");

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
            { this.props.children.map((item, i) => {
              return <li key={i} className="AppMenu__item" onClick={toggleMenu}>{item}</li>
            }) }
          </ul>
        </div>
      </div>
    );
  }

});
