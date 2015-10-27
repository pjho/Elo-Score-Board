import React from 'react';

module.exports = React.createClass( {

  render() {
    /*
    * Ick.. spaghetti logic for determining state of buttons in relation to other application buttons
    */
    let isWinner = this.props.id === this.props.currentGame.winner ? true : false;
    let isLoser = this.props.id === this.props.currentGame.loser ? true : false;
    let hasOtherWinner = !isWinner && this.props.currentGame.winner !== null;
    let hasOtherLoser = !isLoser && this.props.currentGame.loser !== null;

    // Set classes for win button.
    // If it's a winner give it color.
    let winClasses = "btn" + (isWinner ? ' btn-success ': ' btn-default ');
    // if another player is a winner or this player is current loser disable the win button
    if( !isWinner &&  ( hasOtherWinner || isLoser) ){
         winClasses += " disabled ";
    }

    // Set classes lose button.
    // If it's a loser give it color.
    let loseClasses = "btn" + (isLoser ? ' btn-danger ': ' btn-default ');
    // if another player is a loser or this player is current winner disable the lose button
    if( !isLoser &&  ( hasOtherLoser || isWinner) ){
         loseClasses += " disabled ";
    }

    return (
      <div className="action-buttons play-buttons">
        <a className={winClasses} onClick={ this.handleWin.bind(this, isWinner) }>Winner</a>
        <a className={loseClasses} onClick={ this.handleLose.bind(this, isLoser) }>Loser</a>
      </div>
    );
  },

  handleWin(isWinner) {
    // if currently active and clicked again set null, else set active
    this.props.onPlay('winner', isWinner ? null : this.props.id);
  },

  handleLose(isLoser) {
    // if currently active and clicked again set null, else set active
    this.props.onPlay('loser', isLoser ? null : this.props.id);
  }

});
