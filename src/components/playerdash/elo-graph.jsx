import React from 'react';
import {Chart} from 'react-google-charts';

export const EloGraph = React.createClass({

  render() {

    let data = this.props.graph.map( (item) => {
      let score = item.winner == this.props.playerId ? item.winnerNewScore : item.loserNewScore;
      let date = new Date(item.dateTime);
      return [date, score, 1600];
    });

    let graphContainer = document.getElementById('EloGraphWrapper');
    let graphHeight = graphContainer ? graphContainer.offsetWidth * 0.65 : 0;
    let graphWidth = graphContainer.offsetWidth < 650 ? '98%' : '86%';

    let chart =  {
      rows : data,
      columns : [
        { label : "date time", type: "datetime", format: 'MMM d'},
        { label : "Elo Rating", type: "number" },
        { label : "Baseline", type: "number" }
      ],
      options : {
        legend: {position:'none'},
        title: `${this.props.days} Day Elo Rating`,
        hAxis: {title: '', format: 'MMM d' },
        vAxis: {title: 'Elo Rating', format:'####'},
        chartArea: {'width': graphWidth, 'height': '78%'},
        trendlines: { 0: {color: '#AEAEAE', opacity: 1, enableInteractivity: false} },
        series: {
            0: { pointSize: 3 },
            1: { enableInteractivity: false },
            2: { enableInteractivity: false },
        },
      },
      chartType : false ? "AnnotationChart" : "LineChart",
      div_id: "elo_line_graph"
    };


    return (
      <div className="EloGraph">
        <Chart chartType={chart.chartType}
          width={"100%"}
          height={graphHeight + "px"}
          rows={chart.rows}
          columns={chart.columns}
          options = {chart.options}
          graph_id={chart.div_id}
        />
      </div>
    );
  }
});
