import React from 'react';
import { PlayButtons } from './play-buttons';
import { EditButtons } from './edit-buttons';
import { PlayerForm } from './player-form';
import { Link } from 'react-router';
import { daysSince } from '../../utils/utilities';


export const Player = React.createClass({

  getInitialState(){
    return {
      editPlayerMode: false
    }
  },

  componentWillMount() {
    this.firebase = this.props.firebase;
    this.setState({ editPlayerMode: false });
  },

  render() {
    return this.state.editPlayerMode && this.props.editMode ? this.displayEditPlayerForm() : this.displayPlayer();
  },

  componentWillReceiveProps(nextProps) {
    !nextProps.editMode && this.setState({editPlayerMode: false});
  },

  displayPlayer() {
    const { rank, name, image, league, score, topScore, wins, losses, lastPlayed,
            showAll, id, bottomScore, streak, bestStreak, worstStreak, authed, leagues } = this.props;


    return (
      <tr className={ showAll ? '' : this.getOpacityClass(daysSince(lastPlayed)) }>
        <td className="hide_sm">
          {rank}
        </td>

        <td>
          <Link to={`/league/${league}/player/${id}`}>
            <img src={!!image ? image : '/img/avatar.jpg'} alt={name} className="img-circle img-thumbnail" />
            {name}
          </Link>
        </td>

        <td className="hide_sm">
          <Link to={`/league/${encodeURI(league)}`}>{league}</Link>
        </td>

        <td className="rangeDisplay playerScore tc">
          <sup>{topScore}</sup>
          <span className="displayVal">{score}</span>
          <sub>{bottomScore}</sub>
        </td>

        <td className={ "rangeDisplay playerStreak tc playerStreak--" + (streak && (streak > 0 ? "positive" : "negative" ))}>
          <sup>{bestStreak ? "+" + bestStreak : ''}</sup>
          <span className="displayVal">{streak ? (streak > 0 &&  '+') + streak : '-' }</span>
          <sub>{worstStreak ? worstStreak : ''}</sub>
        </td>

        <td className="playerRatio tc">
            { wins + losses > 9
              ? <span className="displayVal">{ Math.round(wins / (wins + losses) * 100) || 0 }</span>
              : '-'
            }
        </td>
        { authed &&
          <td className="text-right">
            { this.actionButtons() }
          </td>
         }
      </tr>
    );
  },

  displayEditPlayerForm () {
    return (
      <tr className="warning">
        <td colSpan={ window.innerWidth > 800 ? 6 : 4 }>
          <PlayerForm {...this.props} method="update" submitCallback={this.handleUpdatePlayer} className="form-inline" />
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
        ? <EditButtons id={this.props.id}
            active={this.state.editPlayerMode}
            handleDelete={this.handleDeletePlayer}
            handleEditMode ={this.handleEditMode}
          />
        : <PlayButtons  onPlay={this.props.onPlay} id={this.props.id} currentGame={this.props.currentGame} />
     );
  },

  handleDeletePlayer() {
    if( confirm('Do you really want to delete ' + this.props.name + '?') ) {
      this.firebase.deletePlayer(this.props.id)
    }
  },

  handleUpdatePlayer(player) {
    this.firebase.updatePlayer(this.props.id, player, () => {
      // If a league is changed this player may not be mounted
      if (this.isMounted()) {
        this.setState({ editPlayerMode: false });
      }
    });
  },

  handleEditMode() {
    this.setState({
      editPlayerMode: !this.state.editPlayerMode
    });
  },

  getOpacityClass (days) {
    if ( days <= 7 || days > 16 || isNaN(days) ) { return '' }
    else if (days > 16) { return 'opacity-0' }

    // I wish I could math.
    return `opacity-${[9, 8, 7, 6, 5, 4, 3, 2, 1][days - 8]}`;
  }

});
