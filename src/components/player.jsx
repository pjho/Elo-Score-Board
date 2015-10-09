import React from 'react';
import Firebase from 'firebase';
import PlayButtons from './play-buttons';
import EditButtons from './edit-buttons';
import EditPlayerForm from './player-form';
import conf from '../../app.config.json';

module.exports = React.createClass( {

  getInitialState(){
    return {
      editMode: false
    }
  },

  componentWillMount() {

  },

  render() {
    return this.state.editMode ? this.displayEditUserForm() : this.displayUser();
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
        ? <EditButtons id={this.props.id} handleDelete={this.deleteUser} handleEdit ={this.handleEditMode} />
        : <PlayButtons  onPlay={this.props.onPlay} id={this.props.id} currentGame={this.props.currentGame} />
     );
  },

  handleEditMode() {
    this.setState({
      editMode: ! this.state.editMode
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
    this.setState({ editMode: false })
  }
});
