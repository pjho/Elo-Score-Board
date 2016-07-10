import React from 'react';

import { Link } from 'react-router';

export const TableLine = React.createClass({

  render() {
    let {title, value, high, low, className} = this.props;

    return (
      <tr>
        <td>{title}</td>
        <td className={`rangeDisplay tc ${className}`}>
            { high && <sup>{high}</sup> }
              <span className="displayVal">{value}</span>
            { low && <sub>{low}</sub> }
          </td>
      </tr>
    );
  }
});
