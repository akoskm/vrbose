import React from 'react';
import moment from 'moment';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
const LineChart = require('react-chartjs').Line;

class Timeline extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      interval: null,
      running: true,
      labels: [],
      data: [],
      data2: []
    };

    this.toggleResume = this.toggleResume.bind(this);
    this.resume = this.resume.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  rand(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
  }

  resume() {
    if (this.state.interval) {
      clearInterval(this.state.interval);
    }
    this.state.interval = setInterval(() => {
      let oldLabels = this.state.labels;
      oldLabels.push(moment().format('hh:mm:ss'));
      if (oldLabels.length > 9) {
        oldLabels.shift();
      }
      let oldData = this.state.data;
      let oldData2 = this.state.data2;
      oldData.push(this.rand(1, 5));
      oldData2.push(this.rand(1, 5));
      if (oldData.length > 9) {
        oldData.shift();
      }
      if (oldData2.length > 9) {
        oldData2.shift();
      }
      this.setState({
        labels: oldLabels,
        data: oldData,
        data2: oldData2
      });
    }, 5000);
  }

  toggleResume() {
    let isRunning = this.state.running;
    if (isRunning) {
      clearInterval(this.state.interval);
    } else {
      this.resume();
    }
    this.setState({
      running: !isRunning
    });
  }

  render() {
    let buttonText = this.state.running ? 'Pause' : 'Resume';
    if (this.state.running) {
      this.resume();
    }
    let data = {
      labels: this.state.labels,
      datasets: [{
        label: 'My First dataset',
        fillColor: 'rgba(220,220,220,0.2)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: this.state.data
      }, {
        label: 'My Second dataset',
        fillColor: 'rgba(151,187,205,0.2)',
        strokeColor: 'rgba(151,187,205,1)',
        pointColor: 'rgba(151,187,205,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(151,187,205,1)',
        data: this.state.data2
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
            <Form inline>
              <FormGroup>
                <Button type='button' onClick={this.toggleResume}>
                  {buttonText}
                </Button>
              </FormGroup>
              <FormGroup className='pull-right'>
                {' '}
                <ControlLabel>Refresh interval</ControlLabel>
                {' '}
                <FormControl componentClass='select' placeholder='select'>
                  <option value='1'>1s</option>
                  <option value='5'>5s</option>
                  <option value='10'>10s</option>
                </FormControl>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md={12} xs={12} lg={12}>
            <LineChart data={data} options={options} width='600' height='250'/>
          </Col>
        </Row>
      </div>
    );
  }
}

Timeline.propTypes = {
  matchers: React.PropTypes.object.isRequired
};

export default Timeline;
