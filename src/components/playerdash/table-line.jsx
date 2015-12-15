import React from 'react';

import { Link } from 'react-router';

export const TableLine = React.createClass({

  render() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td>{this.props.value}</td>
      </tr>
    );
  }
});
