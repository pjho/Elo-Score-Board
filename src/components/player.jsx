import React from 'react';
import Firebase from 'firebase';
import PlayButtons from './play-buttons';
import EditButtons from './edit-buttons';
import EditPlayerForm from './player-form';
import conf from '../../app.config.json';
import { Link } from 'react-router';

module.exports = React.createClass( {

  getInitialState(){
    return {
      editPlayerMode: false
    }
  },

  render() {
    return this.state.editPlayerMode ? this.displayEditUserForm() : this.displayUser();
  },

  displayUser() {
    return (
      <tr>
        <td className="hide_sm">{this.props.rank}</td>
        <td>
            <img src={this.props.image} alt={this.props.name} className="img-circle img-thumbnail" />
            {this.props.name}
        </td>
        <td className="hide_sm">
          <Link to={`/league/${encodeURI(this.props.league)}`}>{this.props.league}</Link>
        </td>
        <td>{this.props.score}</td>
        <td>{this.props.streak || 0}</td>
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
          <EditPlayerForm {...this.props} method="update" submitCallback={this.updateUser} />
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
