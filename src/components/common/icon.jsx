import React from 'react';

module.exports = React.createClass( {

  render() {
    return (
      <span className={`glyphicon glyphicon-${this.props.type}`}></span>
    );
  }

});
