import React from 'react';

import { Link } from 'react-router';

export const TableLine = React.createClass({

  render() {
    let {title, value, high, low} = this.props;

    return (
      <tr>
        <td>{title}</td>
        <td className="rangeDisplay tc">
            { high && <sup>{high}</sup> }
            <span className="displayVal">{value}</span>
            { low && <sub>{low}</sub> }
          </td>
      </tr>
    );
  }
});
