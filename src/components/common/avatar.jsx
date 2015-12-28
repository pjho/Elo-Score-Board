import React from 'react';

export const Avatar =  React.createClass( {

  render() {
    return (
      <img className={"img-circle img-thumbnail " + this.props.className}
        src={ this.props.src || '/img/avatar.jpg' }
        title={this.props.title}
        alt={this.props.alt}
      />
    );
  }

});
