import React from 'react';
import _validate from '../../utils/validator'
import _ from 'lodash';

export const PlayerForm = React.createClass({

  getInitialState(){
    return {
      errors: {
        name: null,
        image: null,
        league: null,
        score: null
      },
      valid: true
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    let player = {
      name: _.trim(this.refs.name.value),
      image: _.trim(this.refs.image.value) || false,
      league: _.trim(this.refs.league.value),
      score: parseInt(this.refs.score.value)
    };

    if(this.props.method === 'add') {
      player.wins = 0;
      player.losses = 0;
      player.streak = 0;
      player.topScore = player.score;
      player.bottomScore = player.score;
      player.bestStreak = 0;
      player.worstStreak = 0;
    }

    let isValid = this.validate(player);

    if(isValid) {
      this.props.submitCallback(player);
      this.refs.playerForm.reset();
    }
  },


  validate(player) {

    let imgRule = {
      pattern: /^https?:\/\/.+\.(png|jpg|jpeg|gif)$/i,
      message: "must be an absolute Url"
    };

    let errors = {
      name : _validate.string( player.name, 1, 100 ).messages[0] || null,
      image : player.image === false ? null : _validate.string( player.image, 1, 300, imgRule ).messages[0] || null,
      league : _validate.string( player.league, 1, 100 ).messages[0] || null,
      score : _validate.int(player.score,0,100000).messages[0] || null
    };

    let isValid = [errors.name, errors.image, errors.league, errors.score].every( i => i == null);

    this.setState({
      errors: errors,
      valid: isValid
    });

    return isValid;
  },

  render() {
    let classes = this.props.className;

    return (
      <form ref="playerForm" className={classes + " player-form form  " + (!this.state.valid ? "has-errors" : "") } onSubmit={this.handleSubmit}>

        <div className={ "form-group " + this.errorClass('name') }>
          <label className="control-label" htmlFor="player-name">Name</label>
          <input ref="name" type="text" className="form-control" id="player-name"  defaultValue={this.props.name || ''} />
          { this.errorMessage('name') }
        </div>

        <div className={ "form-group " + this.errorClass('image') }>
          <label className="control-label" htmlFor="player-name">Image Url</label>
          <input ref="image" type="text" className="form-control" id="player-image" placeholder="http://..."  defaultValue={this.props.image || ''}/>
          { this.errorMessage('image') }
        </div>

        <div className={ "form-group " + this.errorClass('league') }>
          <label className="control-label" htmlFor="player-name">League</label>
          <input ref="league" type="text" className="form-control" id="player-league"  defaultValue={this.props.league || ''} />
          { this.errorMessage('league') }
        </div>

        <div className={ "form-group " + this.errorClass('score') }>
          <label className="control-label" htmlFor="player-name">Initial Score</label>
          <input ref="score" type="text" className="form-control" id="player-score" defaultValue={this.props.score || '1600'} />
          { this.errorMessage('score') }
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {_.capitalize(this.props.method) + " Player"}
          </button>
        </div>
      </form>
    );
  },

  errorClass(type) {
    return this.state.errors[type] === null ? "" : "has-error";
  },

  errorMessage(type){
    if(this.state.errors[type] !== null){
      return <span className="help-block">{_.capitalize(type) + ' ' + this.state.errors[type] }</span>
    }
  }
});
