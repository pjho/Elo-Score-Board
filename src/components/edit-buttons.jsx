import React from 'react';
import Icon from './icon'
module.exports = React.createClass( {

  render() {
    return (
      <div className="action-buttons">
        {
          this.props.active
          ? <a href="#" className="btn btn-default" onClick={this.props.handleEdit} title="Cancel"><Icon type="remove" /></a>
          : <a href="#" className="btn btn-warning" onClick={this.props.handleEdit} title="Edit"><Icon type="edit" /></a>
        }


        <a href="#" className="btn btn-danger" onClick={this.props.handleDelete} title="Remove Player"><Icon type="trash" /></a>
      </div>
    );
  }

});
