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

  let dataSet = [];
  let labelsText = [];
  const resolution = 30;
  const iterations = 10;

  let oldTime;
  let startTime = moment();
  const isBetween = (h) => {
    let createdOn = moment(h.createdOn);
    return createdOn.isBetween(startTime, oldTime);
  };

  const matchers = props.matchers;
  if (matchers && matchers.length > 0) {
    let matcher = matchers[0];
    if (matcher.history) {
      let last = matcher.history[matcher.history.length - 1];
      if (last) {
        for (let i = 0; i < iterations; i++) {
          // labels.unshift(startTime.format('HH:mm:ss'));
          oldTime = moment(startTime);
          startTime.subtract(resolution, 'm');
          labelsText.unshift(startTime.format('HH:mm') + ' - ' + oldTime.format('HH:mm'));

          let between = matcher.history.filter(isBetween);
          let total = between.reduce(function (prev, curr) {
            return prev + curr.total;
          }, 0);
          dataSet.unshift(total);
        }
      }
    }

    let data = {
      labels: labelsText,
      datasets: [{
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: dataSet
      }]
    };
    let options = {
      responsive: true,
      maintainAspectRatio: true
    };
    return (
      <div>
        <Row>
          <Col md={12} xs={12} lg={12}>
            <LineChart data={data} options={options} width='600' height='250'/>
          </Col>
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
