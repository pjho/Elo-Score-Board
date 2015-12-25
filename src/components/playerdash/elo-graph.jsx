import React from 'react';
import {Chart} from 'react-google-charts';

export const EloGraph = React.createClass({

  render() {

    let data = this.props.graph.map( (item) => {
      let score = item.winner == this.props.playerId ? item.winnerNewScore : item.loserNewScore;
      let date = new Date(item.dateTime)
      return [date, score];
    });

    let winWidth = window.innerWidth;
    let graphHeight = winWidth > 800 ? 600 : winWidth > 485 ? 350 : 260;

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
      // chartType : "AnnotationChart",
      chartType : false ? "AnnotationChart" : "LineChart",
      div_id: "elo_line_graph"
    };



    return (
      <Chart chartType={AnnotationChart.chartType}
        width={"100%"}
        height={"470px"}
        // height={graphHeight + "px"}
        rows={AnnotationChart.rows}
        columns={AnnotationChart.columns}
        options = {AnnotationChart.options}
        graph_id={AnnotationChart.div_id}
      />
    );
  }
});
