import React from 'react';

export const Icon =  React.createClass( {

  render() {
    return (
      <span className={`glyphicon glyphicon-${this.props.type}`}></span>
    );
  }

});
