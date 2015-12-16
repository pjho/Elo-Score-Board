import React from 'react';

export const Loader =  React.createClass( {

  render() {
    return (
      <div className="loaderContainer">
        <div className="loader">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    );
  }

});
