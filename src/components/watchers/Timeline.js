import React from 'react';
import moment from 'moment';
import request from 'superagent';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
const LineChart = require('react-chartjs').Bar;

const Timeline = (props) => {
  const primaryColors = [
    'rgba(194, 118, 218, 1)',
    'rgba(209, 154, 102, 1)',
    'rgba(167, 91, 102, 1)'
  ];

  const secondaryColors = [
    'rgba(194, 118, 218, 0.2)',
    'rgba(209, 154, 102, 0.2)',
    'rgba(167, 91, 102, 0.2)'
  ];

  // make these configurable
  let resolution = 59;
  const iterations = 12;

  let dataSet = [];
  let labelsText = [];
  let daysPast = 0;

  let oldTime;
  let startTime = moment();
  let currentTime = moment();
  const isBetween = (h) => {
    let createdOn = moment(h.createdOn);
    return createdOn.isBetween(startTime, oldTime);
  };

  let history = props.history;
  if (history && history.length > 0) {
    let lastDate = moment(history[history.length - 1].createdOn);
    lastDate.startOf('day');
    daysPast = startTime.diff(lastDate, 'days');
    if (daysPast > 0) {
      startTime.subtract(daysPast, 'days').endOf('day');
      resolution = resolution * 2;
    }
  }
  for (let i = 0; i < iterations; i++) {
    oldTime = moment(startTime);
    startTime.subtract(resolution, 'm').startOf('hour');
    labelsText.unshift(startTime.format('HH:mm') + ' - ' + oldTime.format('HH:mm'));

    let between = [];
    if (history && history.length > 0) {
      between = history.filter(isBetween);
    }
    let total = between.reduce(function (prev, curr) {
      return prev + curr.total;
    }, 0);
    dataSet.unshift(total);
  }

  let options = {
    responsive: true,
    maintainAspectRatio: true
  };

  let data = {
    labels: labelsText,
    datasets: [{
      label: 'My First dataset',
      fillColor: secondaryColors[props.index],
      strokeColor: primaryColors[props.index],
      pointColor: primaryColors[props.index],
      pointStrokeColor: '#fff',
      pointHighlightFill: '#fff',
      pointHighlightStroke: 'rgba(220,220,220,1)',
      data: dataSet
    }]
  };

  return (
    <div>
      <LineChart data={data} options={options}/>
    </div>
  );
};

Timeline.propTypes = {
  history: React.PropTypes.object.isRequired,
  index: React.PropTypes.object.isRequired
};

export default Timeline;
