import React from 'react';

import { Link } from 'react-router';

module.exports = React.createClass( {

  render() {
    return (
              <tr>
                <td>{this.props.title}</td>
                <td>{this.props.value}</td>
              </tr>
    );
  }
});
