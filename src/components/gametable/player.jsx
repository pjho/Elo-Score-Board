import React from 'react';
import Firebase from 'firebase';
import { PlayButtons } from './play-buttons';
import { EditButtons } from './edit-buttons';
import { PlayerForm } from './player-form';
import conf from '../../../app.config.json';

import { Link } from 'react-router';

export const Player = React.createClass({

  getInitialState(){
    return {
      editPlayerMode: false
    }
  },

  render() {
    return this.state.editPlayerMode ? this.displayEditUserForm() : this.displayUser();
  },

  displayUser() {

    const { rank, name, image, league, score, topScore, wins, losses,
            id, bottomScore, streak, bestStreak, worstStreak} = this.props;

    // let streak = this.props.streak || false;
    return (
      <tr>
        <td className="hide_sm">
          {rank}
        </td>
        <td>
          <Link to={`/player/${id}`}>
            <img src={image} alt={name} className="img-circle img-thumbnail" />
            {name}
          </Link>
        </td>
        <td className="hide_sm">
          <Link to={`/league/${encodeURI(league)}`}>{league}</Link>
        </td>
        <td className="playerScore tc">
          <sup>{topScore}</sup>
          <span>{score}</span>
          <sub>{bottomScore}</sub>
        </td>
        <td className={ "playerStreak tc playerStreak--" + (streak && (streak > 0 ? "positive" : "negative" ))}>
          <sup>{bestStreak ? "+" + bestStreak : ''}</sup>
          <span>{streak ? (streak > 0 &&  '+') + streak : '-' }</span>
          <sub>{worstStreak ? worstStreak : ''}</sub>
        </td>
        <td className="playerRatio tc">
            { wins + losses > 9
              ? <span>{ Math.round(wins / (wins + losses) * 100) || 0 }</span>
              : '-'
            }
        </td>
        <td className="text-right">
          { this.actionButtons() }
        </td>
      </tr>
    );
  },

  displayEditUserForm () {
    return (
      <tr>
        <td colSpan="4">
          <PlayerForm {...this.props} method="update" submitCallback={this.updateUser} />
        </td>
        <td className="text-right">
          { this.actionButtons() }
        </td>
      </tr>
    );
  },

  actionButtons() {
    return (
      this.props.editMode
        ? <EditButtons id={this.props.id} active={this.state.editPlayerMode} handleDelete={this.deleteUser} handleEdit ={this.handleEditMode} />
        : <PlayButtons  onPlay={this.props.onPlay} id={this.props.id} currentGame={this.props.currentGame} />
     );
  },

  handleEditMode() {
    this.setState({
      editPlayerMode: ! this.state.editPlayerMode
    });
  },

  deleteUser() {
    let fbPath = [conf.firebaseUrl, 'players', this.props.id].join('/');
    let fireBase = new Firebase( fbPath );
    if( confirm('Do you really want to delete ' + this.props.name + '?') ) {
      fireBase.remove();
    }
  },

  updateUser(user) {
    let fbPath = [conf.firebaseUrl, 'players', this.props.id].join('/');
    let fireBase = new Firebase( fbPath );
    fireBase.update(user);
    this.setState({ editPlayerMode: false })
  }
});
