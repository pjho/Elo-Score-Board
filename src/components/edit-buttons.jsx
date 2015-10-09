import React from 'react';

module.exports = React.createClass( {

  render() {
    return (
      <div className="delete-button btn-group">
        <a href="#" className="btn btn-warning" onClick={this.props.handleEdit}>Edit</a>
        <a href="#" className="btn btn-danger" onClick={this.props.handleDelete}>Delete</a>
      </div>
    );
  }

});
