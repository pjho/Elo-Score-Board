import React from 'react';
import { Link } from 'react-router';
import FirebaseLib from '../../utils/FirebaseLib.js';
var Chart = require('react-google-charts').Chart;


module.exports = React.createClass( {

  getInitialState() {
    return {
      AnnotationChart: {
        rows:[],
        columns:[],
        chartType: ""
      }
    }
  },

  componentWillMount() {
    var AnnotationChart =  {
      rows : this.props.graph,
      columns : [
      {
        label : "date time",
        type: "datetime"
      },
      {
        label : "Elo Rating",
        type: "number"
      }

      ],
      options : {title: "Elo Rating", hAxis: {title: 'Date' }, vAxis: {title: 'Elo Rating', format:'####'}},
      chartType : "AnnotationChart",
      div_id: "elo_line_graph"
    };

    this.setState({
      'AnnotationChart': AnnotationChart
    });
  },

  render() {
    return (
      <Chart chartType={this.state.AnnotationChart.chartType} width={"100%"} height={"600px"} rows={this.props.graph} columns={this.state.AnnotationChart.columns} options = {this.state.AnnotationChart.options} graph_id={this.state.AnnotationChart.div_id}  />
      );
  }
});
