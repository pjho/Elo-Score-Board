import React from 'react';
import _ from 'lodash';

module.exports = React.createClass( {

  getInitialState(){
    return {
      editMode: true
    }
  },

  handleSubmit(e) {
    //TODO: Validation
    e.preventDefault();
    var player = {
      name: this.refs.name.getDOMNode().value,
      image: this.refs.image.getDOMNode().value,
      league: this.refs.league.getDOMNode().value,
      score: parseInt(this.refs.score.getDOMNode().value)
    };

    if(this.props.method === 'add'){
      player.wins = 0;
      player.losses = 0;
    }
    this.props.submitCallback(player);
    this.refs.playerForm.getDOMNode().reset();
  },

  render() {
    return (
      <form ref="playerForm" className="player-form form form-inline" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="player-name">Name</label>
          <input ref="name" type="text" className="form-control" id="player-name"  defaultValue={this.props.name || ''}/>
        </div>

        <div className="form-group">
          <label htmlFor="player-name">Image Url</label>
          <input ref="image" type="text" className="form-control" id="player-image" placeholder="http://..."  defaultValue={this.props.image || ''}/>
        </div>

        <div className="form-group">
          <label htmlFor="player-name">League</label>
          <input ref="league" type="text" className="form-control" id="player-league"  defaultValue={this.props.league || ''} />
        </div>

        <div className="form-group">
          <label htmlFor="player-name">Initial Score</label>
          <input ref="score" type="text" className="form-control" id="player-score" defaultValue={this.props.score || '1600'} />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {_.capitalize(this.props.method) + " Player"}
          </button>
        </div>
      </form>
    );
  }
});
