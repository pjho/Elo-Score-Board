import React from 'react';
import ReactDOM from 'react-dom';
import {Icon} from '../common/icon';
import _validate from '../../utils/validator';
import _trim from 'lodash.trim';
import _capitalize from 'lodash.capitalize';

export const PlayerForm = React.createClass({

  getInitialState(){
    return {
      errors: {
        name: null,
        image: null,
        league: null,
        score: null
      },
      valid: true,
      inputLeague: false,
      prevLeague: this.props.league || "",
      league: this.props.league || ""
    }
  },

  handleSubmit(e) {
    e.preventDefault();

    let player = {
      name: _trim(this.refs.name.value),
      image: _trim(this.refs.image.value) || false,
      league: _trim(this.refs.league.value),
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
      valid: isValid,
      inputLeague: false
    });

    return isValid;
  },

  render() {
    let { className: classes, name, image, score, method, leagues} = this.props;
    let { league, prevLeague } = this.state;

    return (
      <form ref="playerForm" className={classes + " player-form form  " + (!this.state.valid ? "has-errors" : "") } onSubmit={this.handleSubmit}>

        <div className={ "form-group " + this.errorClass('name') }>
          <label className="control-label" htmlFor="player-name">Name</label>
          <input ref="name" type="text" className="form-control" id="player-name"  defaultValue={name || ''} />
          { this.errorMessage('name') }
        </div>

        <div className={ "form-group " + this.errorClass('image') }>
          <label className="control-label" htmlFor="player-name">Image Url</label>
          <input ref="image" type="text" className="form-control" id="player-image" placeholder="http://..."  defaultValue={image || ''}/>
          { this.errorMessage('image') }
        </div>

        <div className={ "form-group " + this.errorClass('league') }>
          <label className="control-label" htmlFor="player-name">League</label>
          { this.state.inputLeague
              ? <span className="cancelableInput">
                  <input ref="league" type="text" className="form-control" id="player-league"  defaultValue={league || ''} />
                  <a className="btn btn-sm" onClick={() => this.setState({inputLeague:false, league: prevLeague})}>
                    <Icon type="remove"/>
                  </a>
                </span>
              : <select ref="league" className="form-control" id="player-league"  value={league || ''} onChange={this.handleLeagueSelect}>
                  <option value=""> - Select League - </option>
                  <optgroup label="Leagues">
                    { leagues.map( (_league, i) => <option key={i} value={_league}>{_league}</option> ) }
                  </optgroup>
                  <option value="addNew"> - Add New - </option>
                </select>
          }

          { this.errorMessage('league') }
        </div>

        <div className={ "form-group " + this.errorClass('score') }>
          <label className="control-label" htmlFor="player-name">Initial Score</label>
          <input ref="score" type="text" className="form-control" id="player-score" defaultValue={score || '1600'} />
          { this.errorMessage('score') }
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            {_capitalize(method) + " Player"}
          </button>
        </div>
      </form>
    );
  },

  handleLeagueSelect(e) {
    if(this.refs.league.value == "addNew") {
      this.setState({
          inputLeague: true,
          league: ""
        },
        () => setTimeout(ReactDOM.findDOMNode(this.refs.league).focus(), 300)
      );
    } else {
      this.setState({
        prevLeague: this.refs.league.value,
        league: this.refs.league.value
      });
    }
  },

  errorClass(type) {
    return this.state.errors[type] === null ? "" : "has-error";
  },

  errorMessage(type){
    if(this.state.errors[type] !== null){
      return <span className="help-block">{_capitalize(type) + ' ' + this.state.errors[type] }</span>
    }
  }
});
