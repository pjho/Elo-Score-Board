import React from 'react';
import { Link } from 'react-router';
// import Firebase from 'firebase';
import FirebaseLib from '../../utils/FirebaseLib.js';
// import utils from '../../utils/utilities.js';
var Chart = require('react-google-charts').Chart;


module.exports = React.createClass( {

getInitialState() {
return {
      LineGraphInfo: {
        rows:[],
        columns:[],
        chartType: ""
      }
    }
  },

  componentWillMount() {
    var LineGraphInfo =  {
      rows : this.props.graph,
      columns : [
                  {
                    label : "time",
                    type: "number"
                  },
                  {
                    label : "Elo Rating",
                    type: "number"
                  }
                ],
      options : {title: "Elo Rating", hAxis: {title: 'Date'}, vAxis: {title: 'Elo Rating'}},
      chartType : "LineChart",
      div_id: "elo_line_graph"
    };

    this.setState({
      'LineGraphInfo': LineGraphInfo
    });
  },

  render() {
    return (
   <Chart chartType={this.state.LineGraphInfo.chartType} width={"1000px"} height={"900px"} rows={this.props.graph} columns={this.state.LineGraphInfo.columns} options = {this.state.LineGraphInfo.options} graph_id={this.state.LineGraphInfo.div_id}  />
    );
  }
});