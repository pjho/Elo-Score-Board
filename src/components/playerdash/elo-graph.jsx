import React from 'react';
import {Chart} from 'react-google-charts';

module.exports = React.createClass( {

  render() {
    let items = [];

    this.props.graph.forEach( (rawItem) => {
      let item = rawItem.val();
      item.id = rawItem.key();
      items.push(item);
    });

    let data = items.map( (item) => {
      let score = item.winner == this.props.playerId ? item.winnerNewScore : item.loserNewScore;
      let date = new Date(item.dateTime)
      return [date, score];
    });

    let AnnotationChart =  {
      rows : data,
      columns : [
      {
        label : "date time",
        type: "datetime"
      },
      {
        label : "Elo Rating",
        type: "number"
      }],
      options : {
        title: "Elo Rating", 
        hAxis: {title: 'Date' }, 
        vAxis: {title: 'Elo Rating', 
        format:'####'}
      },
      chartType : "AnnotationChart",
      div_id: "elo_line_graph"
    };

    return (
    <Chart chartType={AnnotationChart.chartType} 
      width={"100%"} 
      height={"600px"} 
      rows={AnnotationChart.rows} 
      columns={AnnotationChart.columns} 
      options = {AnnotationChart.options} 
      graph_id={AnnotationChart.div_id}  
    />
    );
  }
});