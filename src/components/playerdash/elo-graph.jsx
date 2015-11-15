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
      rows : [
                [1447219256248,1600],
                [1447219256249,1610],
                [1447219256250,1620],
                [1447219256251,1640],
                [1447219256252,1656],
                [1447219256253,1634],
                [1447219256254,1665],
                [1447219256255,1600],
                [1447219256256,1623],
                [1447219256257,1645],
                [1447219256258,1456],
                [1447219256259,1676],
                [1447219256260,1634],
                [1447219256261,1623],
                [1447219256262,1676],
              ],
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
   <Chart chartType={this.state.LineGraphInfo.chartType} width={"500px"} height={"300px"} rows={this.state.LineGraphInfo.rows} columns={this.state.LineGraphInfo.columns} options = {this.state.LineGraphInfo.options} graph_id={this.state.LineGraphInfo.div_id}  />
    );
  }
});
