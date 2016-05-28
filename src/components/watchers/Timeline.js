import React from 'react';
import moment from 'moment';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
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
  const resolution = 30;
  const iterations = 10;

  let dataSet = [[], []];
  let labelsText = [[], []];

  let oldTime;
  let startTime = moment();
  let currentTime = moment();
  const isBetween = (h) => {
    let createdOn = moment(h.createdOn);
    return createdOn.isBetween(startTime, oldTime);
  };

  const matchers = props.matchers;
  if (matchers && matchers.length > 0) {
    const matchersLength = matchers.length;
    for (let j = 0; j < matchersLength; j++) {
      let matcher = matchers[j];
      if (matcher.history) {
        let last = matcher.history[matcher.history.length - 1];
        if (last) {
          startTime = moment(currentTime);
          for (let i = 0; i < iterations; i++) {
            oldTime = moment(startTime);
            startTime.subtract(resolution, 'm');
            labelsText[j].unshift(startTime.format('HH:mm') + ' - ' + oldTime.format('HH:mm'));

            let between = matcher.history.filter(isBetween);
            console.log(between);
            let total = between.reduce(function (prev, curr) {
              return prev + curr.total;
            }, 0);
            dataSet[j].unshift(total);
          }
        }
      }
    }

    let options = {
      responsive: true,
      maintainAspectRatio: true
    };

    let chartData = labelsText.map(function (labels, i) {
      return {
        labels,
        datasets: [{
          label: 'My First dataset',
          fillColor: secondaryColors[i],
          strokeColor: primaryColors[i],
          pointColor: primaryColors[i],
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: dataSet[i]
        }]
      };
    });

    return (
      <div>
        <Row>
          {chartData.map(function (data, i) {
            return (
              <Col md={6} xs={6} lg={6}>
                <LineChart data={data} options={options}/>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  } else {
    return <div>no data</div>;
  }
};

Timeline.propTypes = {
  matchers: React.PropTypes.object.isRequired
};

export default Timeline;
