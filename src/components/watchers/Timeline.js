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
            // labels.unshift(startTime.format('HH:mm:ss'));
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

    return (
      <div>
        <Row>
          <Col md={12} xs={12} lg={12}>
            {labelsText.map(function (labels, i) {
              let data = {
                labels,
                datasets: [{
                  label: 'My First dataset',
                  fillColor: 'rgba(220,220,220,0.2)',
                  strokeColor: 'rgba(220,220,220,1)',
                  pointColor: 'rgba(220,220,220,1)',
                  pointStrokeColor: '#fff',
                  pointHighlightFill: '#fff',
                  pointHighlightStroke: 'rgba(220,220,220,1)',
                  data: dataSet[i]
                }]
              };
              return (<LineChart data={data} options={options} width='600' height='250'/>);
            })}
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
